<template lang="pug">
div
  editor-content(:editor="editor")
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Editor, EditorContent} from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import Strike from '@tiptap/extension-strike';
import {Definition} from '@/components/TextEditorDefinition';
import { EventBusMessage, TextDefinition } from '~/types/seven-steps';
import cuid from 'cuid';
import cloneDeep from 'lodash.clonedeep';
import { definitionExists, getDefinitionEditor } from '~/assets/ts/definition-util';

@Component({
  components: {
    EditorContent
  }
})
export default class TextEditor extends Vue {
  @Prop({default: ''})
  private readonly text!: string;

  private editor: Editor = new Editor({
    content: cloneDeep(this.text),
    extensions: [StarterKit, Definition],
    editable: false,
  });

  get editorJson() {
    return this.editor.getJSON();
  }

  get definitionList() {
    return this.$store.getters['definition'] as TextDefinition[];
  }

  @Watch('definitionList')
  onDefinitionnChange(newVale: TextDefinition[], oldValue: TextDefinition[]) {
    
    // get definitions from editor as a map
    const mapEditor = getDefinitionEditor(this.editor);

    // get definitions from Vuex and convert to map
    const mapVuex = new Map<string, {id: string, from: number, to: number, definition: string}>();
    this.definitionList.forEach(defVuex => {
      defVuex.range.forEach(rangeVuex => {
        mapVuex.set(
          `${rangeVuex.from}-${rangeVuex.to}`,
          {
            id: defVuex.localId,
            from: rangeVuex.from,
            to: rangeVuex.to,
            definition: defVuex.definition
          }
        );
      })
    });

    // delete the ranges that don't exist in Vuex anymore
    mapEditor.forEach((defEditor, key) => {
      if(mapVuex.get(key) === undefined) {
        this.editor.commands.setTextSelection({from: defEditor.from, to: defEditor.to});
        this.editor.commands.unsetDefinition();
      }
    })

    // create and update the ranges from Vuex to the editor
    mapVuex.forEach((defVuex, key) => {
      const defEditor = mapEditor.get(key);

      // create marks that don't exist
      if(defEditor === undefined) {
        this.editor.commands.setTextSelection({from: defVuex.from, to: defVuex.to});

        this.editor.commands.setDefinition({
          id: defVuex.id,
          from: defVuex.from,
          to: defVuex.to,
          definition: defVuex.definition,
        });

      // update marks that exist but aren't up-to-date
      } else if(
        defVuex.id !== defEditor.id ||
        defVuex.definition !== defEditor.definition
      ) {
        this.editor.commands.setTextSelection({from: defVuex.from, to: defVuex.to});
        this.editor.commands.updateAttributes('definition', {
          definition: defVuex.definition,
          id: defVuex.id
        });
      }
    });
  }


  beforeDestroy() {
    this.editor.destroy();
    this.$bus.$off('text-definition-add');
  }
 
  mounted() {

    /** mark the selected text as a definition */
    this.$bus.$on('text-definition-add', (message: EventBusMessage) => {
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

      const definition: TextDefinition = {
        localId,
        range,
        definition: message.payload.definition
      };

      // add/update the new definition if the range doesn't intersect an existing definition
      if(!definitionExists(this.definitionList, definition)) {
        if(message.payload.localId === '') {
          this.$store.commit('definitionCreate', definition);
        } else {
          this.$store.commit('definitionRangeAdd', {localId: definition.localId, range: definition.range})
        }
      }
    });
  }

}
</script>

<style lang="scss">
.ProseMirror {
  .definition {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
}
</style>