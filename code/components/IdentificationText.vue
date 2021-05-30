<template lang="pug">
div
  editor-content(:editor="editor")
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Editor, EditorContent} from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import {Claim as TextEditorClaim} from '~/components/TextEditorClaim';
import { EventBusMessage, TextClaim } from '~/types/seven-steps';
import cuid from 'cuid';
import cloneDeep from 'lodash.clonedeep';
import { rangeExists, getClarificationEditor } from '~/assets/ts/clarification-util';

@Component({
  components: {
    EditorContent
  }
})
export default class TextEditor extends Vue {
  @Prop({default: ''})
  private readonly text!: any;

  private editor: Editor = new Editor({
    content: cloneDeep(this.text),
    extensions: [StarterKit, TextEditorClaim],
    editable: false,
  });

  /** return a JSON version of the text */
  get editorJson() {
    return this.editor.getJSON();
  }

  /** get the list of clarifications from Vuex */
  get clarificationList() {
    return this.$store.getters['clarification'] as TextClarification[];
  }

  /** When the list of clarifications changes the text is updated accordingly */
  @Watch('clarificationList')
  onClarificationChange(newVale: TextClarification[], oldValue: TextClarification[]) {
    
    // get clarifications from editor as a map
    const mapEditor = getClarificationEditor(this.editor);

    // get clarifications from Vuex and convert to map
    const mapVuex = new Map<string, {id: string, from: number, to: number, clarification: string}>();
    this.clarificationList.forEach(defVuex => {
      defVuex.range.forEach(rangeVuex => {
        mapVuex.set(
          `${rangeVuex.from}-${rangeVuex.to}`,
          {
            id: defVuex.localId,
            from: rangeVuex.from,
            to: rangeVuex.to,
            clarification: defVuex.clarification
          }
        );
      })
    });

    // delete the ranges that don't exist in Vuex anymore
    mapEditor.forEach((defEditor, key) => {
      if(mapVuex.get(key) === undefined) {
        this.editor.commands.setTextSelection({from: defEditor.from, to: defEditor.to});
        this.editor.commands.unsetClarification();
      }
    })

    // create and update the ranges from Vuex to the editor
    mapVuex.forEach((defVuex, key) => {
      const defEditor = mapEditor.get(key);

      // create marks that don't exist
      if(defEditor === undefined) {
        this.editor.commands.setTextSelection({from: defVuex.from, to: defVuex.to});

        this.editor.commands.setClarification({
          id: defVuex.id,
          from: defVuex.from,
          to: defVuex.to,
          clarification: defVuex.clarification,
        });

      // update marks that exist but aren't up-to-date
      } else if(
        defVuex.id !== defEditor.id ||
        defVuex.clarification !== defEditor.clarification
      ) {
        this.editor.commands.setTextSelection({from: defVuex.from, to: defVuex.to});
        this.editor.commands.updateAttributes('clarification', {
          clarification: defVuex.clarification,
          id: defVuex.id
        });
      }
    });
  }

  // destroy the editor and stop listening to the events
  beforeDestroy() {
    this.editor.destroy();
    this.$bus.$off('text-clarification-add');
  }
 
  mounted() {
    this.editor.commands.setContent(this.text);

    // mark the selected text as a clarification
    this.$bus.$on('text-clarification-add', this.onTextClarificationAdd);
  }

  /** mark the selected text as a clarification
   * Either create a new clarification, or add a range
   * to an existing clarification.
   */
  onTextClarificationAdd(message: EventBusMessage) {

    // gather information about the selection
    const selection = this.editor.state.selection;
    const doc = this.editor.state.doc;
    const textSelected = doc.textBetween(selection.from, selection.to);

    // chooses the clarification's localId
    // We're adding a range to an existing clarification:
    //  -> use the localId of the existing clarification
    // New clarification:
    //  -> create a new cuid
    const localId =
      message.payload.localId === '' ?
        cuid() :
        message.payload.localId;

    // prepare the range of the clarification
    const range = [{
      from: selection.from,
      to: selection.to,
      text: textSelected
    }];

    // prepare the clarification
    const clarification: TextClarification = {
      localId,
      range,
      clarification: message.payload.clarification
    };

    // add/update the new clarification if the range doesn't intersect with an existing clarification's range
    if(
      !rangeExists(
        this.clarificationList,
        clarification
      ) &&
        selection.from !== selection.to
      ) {
        if(message.payload.localId === '') {
          this.$store.commit(
            'clarificationCreate',
            clarification
          );
        } else {
          this.$store.commit(
            'clarificationRangeAdd',
            {
              localId: clarification.localId,
              range: clarification.range
            }
          )
        }
    }
  }

}
</script>

<style lang="scss">
.ProseMirror {
  .clarification {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
}
</style>