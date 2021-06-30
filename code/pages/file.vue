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
    v-model="modalRouteLeave" title="Leaving the step 'file'"
    ok-title="continue"
    @ok="routeLeaveConfirmed"
  )
    template(v-if="textAnnotatedEmpty")
      p The edited text here will be copied to the annotated text, which will be used in the next steps. However this can happen only once.
      p If you come back to this step you will be able to edit the text, however these edits will not change the annotated text of the next steps.
      p Do you want to continue?
    template(v-else)
      p The modification on this text will not be transfered to the annotated text, because an annotated text already exist.
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import {Editor, EditorContent} from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';

@Component({
  beforeRouteLeave(to, from, next) {
    const that: any = this;

    if(that.routeConfirmed) {
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

  /** called when the popup to confirm the route leave is validated */
  routeLeaveConfirmed() {
    this.routeConfirmed = true;
    if(Object.keys(this.$store.getters['textAnnotated']).length === 0) {
      this.$store.commit('textAnnotatedUpdate', this.editorJson);
    }
    this.$router.push(this.routeNext);
  }

  /** return a JSON version of the editor's state */
  get editorJson() {
    return this.editor.getJSON();
  }

  /** return whether annotated text is empty */
  get textAnnotatedEmpty() {
    let returnValue = true;

    const textAnnotated = this.$store.getters['textAnnotated'];

    if(Object.keys(textAnnotated).length > 0) {
      returnValue = false;
    }

    return returnValue;
  }

  /** get the text that is in Vuex (useful when coming back to this step) */
  mounted() {
    const text = this.$store.getters['textOriginal'];
    this.editor.commands.setContent(text);
  }

  /** Update the text in Vuex when the text in the editor is changed */
  @Watch('editorJson')
  onEditorChange(newValue: any, oldValue: any) {
    if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      this.$store.commit('textOriginalUpdate', newValue);
    }
  }

  /** Update the file in Vuex when a new file is chosen */
  @Watch('file')
  async onFile() {
    if(this.file.name !== undefined && this.file.name !== ''){
      this.$store.commit('fileOriginalCreate', this.file);
    }
  }

  /** Transform a PDF file into an URL object that can be passed to the tab 'object' */
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