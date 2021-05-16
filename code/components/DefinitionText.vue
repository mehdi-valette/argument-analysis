<template lang="pug">
div.text-definition

  div.mode.d-flex.align-items-center
    b-form-checkbox(
      switch
      v-model="modeSelection"
    ) selection mode&nbsp;
    b-icon(
      icon="question-circle"
      v-b-tootlip.hover
      title="(shortcut: CTRL+Enter) In mode 'selection' we can select the text; otherwise we can read the definitions"
    )

  div.text
    // text for selection (range.startOffset and range.endOffset are correct)
    div.position-absolute(:id="textId" v-if="modeSelection")
      template(v-for="display in textDisplayed")
          template {{display.text}}

    // text for display (range.startOffset and range.endOffset are wrong because of <span>)
    div(style="user-select: none;")
      template(v-for="display in textDisplayed")
        span.highlight-definition(
          v-if="display.highlight"
          v-b-tooltip.hover
          :title="display.definition"
        ) {{display.text}}
        template(v-else) {{display.text}}
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import cuid from 'cuid';
import {BIcon, BIconQuestionCircle} from 'bootstrap-vue';

import {TextDefinition} from '@/types/seven-steps';

@Component({
  components: {
    BIcon,
    BIconQuestionCircle
  }
})
export default class DefinitionText extends Vue {
  @Prop({default: ''})
  private readonly text!: string;

  private modeSelection: boolean = true;

  get textDisplayed() {
      const returnValue: {highlight: boolean, text: string, definition: string}[] = [];

      const range: [number, number, string][] = [];
      this.$store.getters['definition'].forEach((definition: TextDefinition) => {
          definition.range.forEach((r) => {
              range.push([r.start, r.end, definition.definition])
          });
      });

      let rangeEndLast = 0;
      range.sort((a,b) => a[0] > b[0] ? 1 : -1).forEach((range) => {
          // add the text between the end of the previous
          // range and the beginning of this range
          returnValue.push({
              highlight: false,
              text: this.text.substring(rangeEndLast, range[0]),
              definition: '',
          });

          // add the text within the range (highlighted)
          returnValue.push({
              highlight: true,
              text: this.text.substring(range[0], range[1]),
              definition: range[2],
          });

          rangeEndLast = range[1];
      });

      // add the remaining text after the last range
      returnValue.push({
          highlight: false,
          text: this.text.substring(rangeEndLast),
          definition: '',
      });

      return returnValue;
  };

  private textId: string = cuid();

  get definitionList() {
      return this.$store.getters['definition'];
  }

  beforeDestroy() {
      this.$bus.$off('text-selection-definition-get')
  }

  mounted() {
    this.$bus.$on('text-selection-definition-mode-toggle', () => {
      this.modeSelection = !this.modeSelection;
    });

    this.$bus.$on('text-selection-definition-get', () => {
      const payload: TextDefinition = {
        localId: cuid(),
        range: [],
        definition: '',
      }

      const selection = getSelection();

      if(
        selection !== null && selection.type === 'Range' &&
        selection.anchorNode === selection.focusNode &&
        selection.anchorNode?.parentElement?.id === this.textId
      ) {
        [...Array(selection.rangeCount).keys()].forEach((i) => {
          const range = selection.getRangeAt(i);
          const text = this.text.substring(range.startOffset, range.endOffset);
          payload.range.push({start: range.startOffset, end: range.endOffset, text});
        });
      }

      if(payload.range.length > 0) {
        this.$bus.$emit('text-selection-definition-response', payload);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.text-definition {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 0.5em;
  padding: 0.5em;
  overflow: hidden;

  .mode {
    border-bottom: 1px solid black;
    padding-bottom: 0.5em;
    margin-bottom: 0.5em;
  }

  .text {
    position: relative;
    overflow: auto;
    height: auto;

    .highlight-definition {
      text-decoration: underline;
      text-decoration-style: dotted;
      height: auto;
    }
  }
}
</style>