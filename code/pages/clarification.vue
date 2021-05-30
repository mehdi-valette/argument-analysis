<template lang="pug">
div.index
  clarification-text(:text="text")
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
          localId: '',
          clarification: '',
          range: []
        } as TextClarification
      }

      this.$bus.$emit('text-clarification-add', message);
    }
  }
}
</script>

<style lang="scss">
.index {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
  align-content: stretch;
  min-height: 0;
}
</style>
