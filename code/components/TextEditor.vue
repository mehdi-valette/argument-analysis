<template lang="pug">
editor-content(:editor="editor")
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Editor, EditorContent} from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import Strike from '@tiptap/extension-strike';
import {Definition} from '@/components/TextEditorDefinition';
import { BusEvent } from '~/types/seven-steps';
import cuid from 'cuid';

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

  beforeDestroy() {
    this.editor.destroy();
    this.$bus.$off('text-selection-definition-trigger');
  }

  mounted() {
    this.$bus.$on('text-selection-definition-trigger', (message: BusEvent) => {
      const range = this.editor.state.selection.ranges[0];
      const doc = this.editor.state.doc;

      const textSelected = doc.textBetween(range.$from.pos, range.$to.pos);

      this.editor.commands.setDefinition({definitionId: cuid()});
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