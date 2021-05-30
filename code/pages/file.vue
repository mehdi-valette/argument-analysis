<template lang="pug">
div.document
  div.file
    b-form-file(
      v-model="file"
    )
    object.pdf-viewer(:data="fileData" type="application/pdf")
  div.editor
    b-button-group.menu
      b-button(
        @click="editor.chain().focus().toggleHeading({level: 1}).run()"
      ) title
      b-button(
        @click="editor.chain().focus().toggleBulletList().run()"
      ) bullet list
    editor-content.content(:editor="editor")
  
  b-modal(
    v-model="modalRouteLeave" title="leaving the step 'file'"
    ok-title="continue"
    @ok="routeLeave"
  )
    div We will not be able to edit the text after this. Do you want to continue?
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import {Editor, EditorContent} from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';

@Component({
  beforeRouteLeave(to, from, next) {
    const that: any = this;

    if(that.routeConfirmed) {
      console.log('route confirmed');
      next();
    } else {
      that.routeNext = to;
      that.modalRouteLeave = true;
    }
  },
  components: {
    EditorContent
  }
})
export default class Index extends Vue {
  private file: File = new File([], '');
  private modalRouteLeave: boolean = false;
  private routeNext: any = {};
  private routeConfirmed: boolean = false;

  private editor: Editor = new Editor({
    content: 'text',
    extensions: [StarterKit]
  });

  routeLeave() {
    this.routeConfirmed = true;
    this.$router.push(this.routeNext);
  }

  get editorJson() {
    return this.editor.getJSON();
  }

  mounted() {
    const text = this.$store.getters['textOriginal'];
    this.editor.commands.setContent(text);
  }

  @Watch('editorJson')
  onEditorChange(newValue: any, oldValue: any) {
    if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      this.$store.commit('textOriginalUpdate', newValue);
    }
  }

  @Watch('file')
  async onFile() {
    if(this.file.name !== undefined && this.file.name !== ''){
      this.$store.commit('fileOriginalCreate', this.file);
    }
  }

  get fileData() {
    const fileStore: File = this.$store.getters['fileOriginal'];
    let returnValue = ''

    if(fileStore.name !== undefined && fileStore.name !== '') {
      returnValue = URL.createObjectURL(fileStore);
    }

    return returnValue;
  }
}
</script>

<style lang="scss" scoped>
  .document {
    display: flex;
    min-height: 0;

    .file {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      width: 50%;

      .pdf-viewer {
        flex-grow: 1;
      }
    }

    .editor {
      display: flex;
      flex-direction: column;
      border: 1px solid black;
      flex-grow: 1;
      width: 50%;

      .menu {}

      .content {
        padding: 1em;
        overflow: auto;
      }
    }
  }
</style>