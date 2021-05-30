<template lang="pug">
div.text-clarification
  text-editor(:text="text")
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import TextEditor from '@/components/TextEditor.vue';

@Component({
  components: {
    TextEditor
  }
})
export default class ClarificationText extends Vue {
  @Prop({default: ''})
  private readonly text!: string;
}
</script>

<style lang="scss" scoped>
.text-clarification {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 0.5em;
  padding: 0.5em;
  overflow: auto;

  .text {
    position: relative;
    overflow: auto;
    height: auto;
  }
}
</style>