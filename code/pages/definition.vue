<template lang="pug">
div.index
  definition-text(:text="text")
  definition-list
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DefinitionText from '~/components/DefinitionText.vue';
import DefinitionList from '~/components/DefinitionList.vue';
import { EventBusMessage, TextDefinition } from '~/types/seven-steps';

@Component({
  components: {
    DefinitionText,
    DefinitionList
  }
})
export default class Definition extends Vue {

  get text() {
    const textAnnotated = this.$store.getters['textAnnotated'];
    const textOriginal = this.$store.getters['textOriginal'];

    if(Object.keys(textAnnotated).length === 0) {
      this.$store.commit('textAnnotatedUpdate', textOriginal);
    }

    return textAnnotated;
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
          definition: '',
          range: []
        } as TextDefinition
      }

      this.$bus.$emit('text-definition-add', message);
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
