<template lang="pug">
div
  editor-content(:editor="editor")
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import { Claim as TextEditorClaim } from '~/components/TextEditorClaim';
import { Clarification as TextEditorClarification } from '~/components/TextEditorClarification';
import {
  EventBusMessage,
  TextClaim,
  TextClarification,
} from '~/types/interface';
import cuid from 'cuid';
import cloneDeep from 'lodash.clonedeep';
import { getClaimEditor, rangeExists } from '~/assets/ts/text-util';

@Component({
  components: {
    EditorContent,
  },
})
export default class TextEditor extends Vue {
  @Prop({ default: '' })
  private readonly text!: any;

  private editor: Editor = new Editor({
    content: cloneDeep(this.text),
    extensions: [StarterKit, TextEditorClaim, TextEditorClarification],
    editable: false,
  });

  /** return a JSON version of the text */
  get editorJson() {
    return this.editor.getJSON();
  }

  /** get the list of claims from Vuex */
  get claimList() {
    return this.$store.getters['textClaim'] as TextClaim[];
  }

  /** load the clarifications on the annotated text */
  loadClarification() {
    this.$store.getters['clarification'].forEach(
      (clarification: TextClarification) => {
        clarification.range.forEach((range) => {
          this.editor.commands.setTextSelection({
            from: range.from,
            to: range.to,
          });

          this.editor.commands.setClarification({
            id: clarification.idLocal,
            from: range.from,
            to: range.to,
            clarification: clarification.clarification,
          });
        });
      }
    );
  }

  /** When the list of claims changes the text is updated accordingly */
  @Watch('claimList', { deep: true })
  onClaimChange(newVale: TextClaim[], oldValue: TextClaim[]) {
    // get claims from editor as a map
    const mapEditor = getClaimEditor(this.editor);

    // get claims from Vuex and convert to map
    const mapVuex = new Map<
      string,
      { id: string; from: number; to: number; number: number }
    >();
    this.claimList.forEach((defVuex) => {
      defVuex.range.forEach((rangeVuex) => {
        mapVuex.set(`${rangeVuex.from}-${rangeVuex.to}`, {
          id: defVuex.idLocal,
          from: rangeVuex.from,
          to: rangeVuex.to,
          number: defVuex.number,
        });
      });
    });

    // delete the ranges that don't exist in Vuex anymore
    mapEditor.forEach((defEditor, key) => {
      if (mapVuex.get(key) === undefined) {
        this.editor.commands.setTextSelection({
          from: defEditor.from,
          to: defEditor.to,
        });
        this.editor.commands.unsetClaim();
      }
    });

    // create and update the ranges from Vuex to the editor
    mapVuex.forEach((defVuex, key) => {
      const defEditor = mapEditor.get(key);

      // create marks that don't exist
      if (defEditor === undefined) {
        this.editor.commands.setTextSelection({
          from: defVuex.from,
          to: defVuex.to,
        });

        this.editor.commands.setClaim({
          id: defVuex.id,
          from: defVuex.from,
          to: defVuex.to,
          number: defVuex.number,
        });

        // update marks that exist but aren't up-to-date
      } else if (
        defVuex.id !== defEditor.id ||
        defVuex.number !== defEditor.number
      ) {
        this.editor.commands.setTextSelection({
          from: defVuex.from,
          to: defVuex.to,
        });
        this.editor.commands.updateAttributes('claim', {
          number: defVuex.number,
          id: defVuex.id,
        });
      }
    });
  }

  // destroy the editor and stop listening to the events
  beforeDestroy() {
    this.editor.destroy();
    this.$bus.$off('text-claim-add');
  }

  mounted() {
    this.editor.on('create', () => {
      this.loadClarification();
      this.onClaimChange([], []);
    });

    this.editor.commands.setContent(this.text);

    // mark the selected text as a claim
    this.$bus.$on('text-claim-add', this.onTextClaimAdd);
  }

  /** mark the selected text as a claim
   * Either create a new claim, or add a range
   * to an existing claim.
   */
  onTextClaimAdd(message: EventBusMessage) {
    // gather information about the selection
    const selection = this.editor.state.selection;
    const doc = this.editor.state.doc;
    const textSelected = doc.textBetween(selection.from, selection.to);

    // chooses the claim's idLocal
    // We're adding a range to an existing claim:
    //  -> use the idLocal of the existing claim
    // New claim:
    //  -> create a new cuid
    const idLocal =
      message.payload.idLocal === '' ? cuid() : message.payload.idLocal;

    // prepare the range of the claim
    const range = [
      {
        from: selection.from,
        to: selection.to,
        text: textSelected,
      },
    ];

    // prepare the claim
    const claim: TextClaim = {
      idLocal,
      range,
      claim: message.payload.claim,
      stated: true,
      conclusion: false,
      number: 0,
    };

    // add/update the new claim if the range doesn't intersect with an existing claim's range
    if (
      !rangeExists(this.claimList, claim) &&
      selection.from !== selection.to
    ) {
      // create a claim if the idLocal wasn't supplied
      if (message.payload.idLocal === '') {
        this.$store.dispatch('textClaimCreate', claim);

        // update the claim if the idLocal was supplied
      } else {
        this.$store.commit('textClaimRangeAdd', {
          idLocal: claim.idLocal,
          range: claim.range,
        });
      }
    }
  }
}
</script>

<style lang="scss">
.ProseMirror {
  .claim {
    background-color: yellow;
    padding: 0.1em;
    border-radius: 0.1em;
    border: 1px solid black;
  }
}
</style>
