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
import { BusEvent, TextDefinition, TextSelection } from '~/types/seven-steps';
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
    content: this.text,
    extensions: [StarterKit, Definition],
    editable: false,
  });

  get editorJson() {
    return this.editor.getJSON();
  }

  /** synchronise the definitions from the editor to Vuex */
  @Watch('editorJson')
  onEditorChange(newValue: any, oldValue: any) {

    // nothing to do if nothing has changed
    if(JSON.stringify(newValue) === JSON.stringify(oldValue)) {
      return;
    }

    // get definitions from Vuex
    const definitionVuex = this.$store.getters['definition'] as TextDefinition[];
    
    // get definitions from editor
    const definitionEditor = getDefinitionEditor(this.editor);

    // add the new definition to the store
    definitionEditor.filter(
      defEd => !definitionVuex.some(
        defVuex => defVuex.localId === defEd.localId
      )
    ).forEach(definition => {
      this.$store.commit('definitionCreate', definition);
    });

    // remove deleted definitions from the store
    definitionVuex.filter(
      defVuex => !definitionEditor.some(
        devEd => devEd.localId === defVuex.localId
      )
    ).forEach(definition => {
      this.$store.commit('definitionDelete', definition.localId);
    });

    // update the range in Vuex
    definitionEditor.forEach(defEd => {
      // get the definition in vuex
      const defVuex = definitionVuex.find(
        defVuex => defVuex.localId === defEd.localId
      );

      // update the range in Vuex if the ranges don't match
      if(
        defVuex !== undefined &&
        JSON.stringify(defEd.range) !== JSON.stringify(defVuex.range)
      ) {
        this.$store.commit(
          'definitionRangeUpdate',
          {localId: defEd.localId, range: defEd.range}
        );
      }

      // update the definition in Vuex in the definitions don't match
      if(defVuex !== undefined && defEd.definition !== defVuex.definition) {
        this.$store.commit('definitionUpdate', {localId: defEd.localId, newDefinition: defEd.definition});
      }
    });
  }

  beforeDestroy() {
    this.editor.destroy();
    this.$bus.$off('text-selection-definition-trigger');
  }
 
  mounted() {
    this.onEditorChange(this.editor.getJSON(), {});

    /** mark the selected text as a definition */
    this.$bus.$on('text-selection-definition-trigger', (message: BusEvent) => {
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

      // verify if there's another definition within this range
      if(!definitionExists(this.editor, definition)) {
        this.editor.commands.setDefinition({
          id: definition.localId,
          from: definition.range[0].from,
          to: definition.range[0].to,
          definition: definition.definition,
        });
      }
    });

    /** update the definition of the text */
    this.$bus.$on('text-definition-update', (message: BusEvent) => {
      const rangeList = message.payload.definition.range;
      const newDefinition = message.payload.newDefinition;

      rangeList.forEach((range: TextSelection) => {
        this.editor.commands.setTextSelection({from: range.from, to: range.to});
        this.editor.commands.updateAttributes('definition', {definition: newDefinition});
      });
    });

    /** unmark a range */
    this.$bus.$on('text-definition-range-delete', (message: BusEvent) => {
      const from = message.payload.from;
      const to = message.payload.to;

      this.editor.commands.setTextSelection({from, to});
      this.editor.commands.unsetMark('definition');
    });
  
    /** unmark all ranges of a definition */
    this.$bus.$on('text-definition-delete', (message: BusEvent) => {
      (message.payload as TextDefinition).range.forEach(range => {
        this.editor.commands.setTextSelection({from: range.from, to: range.to});
        this.editor.commands.unsetMark('definition');
      })
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