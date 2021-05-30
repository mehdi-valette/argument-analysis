<template lang="pug">
div
  editor-content(:editor="editor")
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Editor, EditorContent} from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import {Clarification} from '~/components/TextEditorClarification';
import { EventBusMessage, TextClarification } from '~/types/seven-steps';
import cuid from 'cuid';
import cloneDeep from 'lodash.clonedeep';
import { clarificationExists, getClarificationEditor } from '~/assets/ts/clarification-util';

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
    extensions: [StarterKit, Clarification],
    editable: false,
  });

  get editorJson() {
    return this.editor.getJSON();
  }

  get clarificationList() {
    return this.$store.getters['clarification'] as TextClarification[];
  }

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


  beforeDestroy() {
    this.editor.destroy();
    this.$bus.$off('text-clarification-add');
  }
 
  mounted() {
    this.editor.commands.setContent(this.text);

    /** mark the selected text as a clarification */
    this.$bus.$on('text-clarification-add', (message: EventBusMessage) => {
      const selection = this.editor.state.selection;
      const doc = this.editor.state.doc;
      const textSelected = doc.textBetween(selection.from, selection.to);

      const localId =
        message.payload.localId === '' ?
          cuid() :
          message.payload.localId;

      const range = [{
        from: selection.from,
        to: selection.to, text: textSelected
      }];

      const clarification: TextClarification = {
        localId,
        range,
        clarification: message.payload.clarification
      };

      // add/update the new clarification if the range doesn't intersect an existing clarification
      if(!clarificationExists(this.clarificationList, clarification) && selection.from !== selection.to) {
        if(message.payload.localId === '') {
          this.$store.commit('clarificationCreate', clarification);
        } else {
          this.$store.commit('clarificationRangeAdd', {localId: clarification.localId, range: clarification.range})
        }
      }
    });
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