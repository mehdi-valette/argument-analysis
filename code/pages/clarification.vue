<template lang="pug">
div.clarification
  clarification-text.text(:text="text")
  clarification-list
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ClarificationText from '~/components/ClarificationText.vue';
import ClarificationList from '~/components/ClarificationList.vue';
import { EventBusMessage, TextClarification } from '~/types/seven-steps';

@Component({
  components: {
    ClarificationText,
    ClarificationList
  }
})
export default class Clarification extends Vue {

  get text() {
    return this.$store.getters['textAnnotated'];
  }

  mounted() {
    window.addEventListener('keydown', this.keyboardHandler);
  }

  beforeDestroy() {
    window.removeEventListener('keydown', this.keyboardHandler);
  }

  keyboardHandler(event: KeyboardEvent) {
    if(event.key === "Enter" && event.ctrlKey === false) {
      const message: EventBusMessage = {
        header: [{emitter: 'index'}],
        payload: {
          idLocal: '',
          clarification: '',
          range: []
        } as TextClarification
      }

      this.$bus.$emit('text-clarification-add', message);
    }
  }
}
</script>

<style lang="scss" scoped>
.clarification {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: stretch;
  min-height: 0;

  .text {
    overflow: auto;
    border: 1px solid black;
    border-radius: .3em;
    padding: .5em;
  }
}
</style>
