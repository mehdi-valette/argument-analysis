<template lang="pug">
div.index
  identification-text(:text="text")
  identification-list
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import IdentificationText from '~/components/IdentificationText.vue';
import IdentificationList from '~/components/IdentificationList.vue';
import { EventBusMessage, TextClaim, TextClarification } from '~/types/seven-steps';

@Component({
  components: {
    IdentificationText,
    IdentificationList
  }
})
export default class Identification extends Vue {

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
          range: [],
          claim: {
            translation: {default: ''},
            logic: {}
          },
          stated: false,
          conclusion: false
        } as TextClaim
      }

      this.$bus.$emit('text-claim-add', message);
    }
  }
}
</script>

<style lang="scss">
.index {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: stretch;
  min-height: 0;
}
</style>
