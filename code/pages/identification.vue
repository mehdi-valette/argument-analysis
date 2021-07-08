<template lang="pug">
div.identification
  identification-text.text(:text="text")
  identification-list
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import IdentificationText from '~/components/IdentificationText.vue';
import IdentificationList from '~/components/IdentificationList.vue';
import {
  EventBusMessage,
  TextClaim,
  TextClarification,
} from '~/types/interface';
import cuid from 'cuid';

@Component({
  components: {
    IdentificationText,
    IdentificationList,
  },
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
    if (event.key === 'Enter' && event.ctrlKey === false) {
      const message: EventBusMessage = {
        header: [{ emitter: 'index' }],
        payload: {
          idLocal: '',
          range: [],
          claim: {
            idLocal: cuid(),
            translation: { default: '' },
            logic: {},
          },
          stated: false,
          conclusion: false,
          number: 0,
        } as TextClaim,
      };

      this.$bus.$emit('text-claim-add', message);
    }
  }
}
</script>

<style lang="scss">
.identification {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: stretch;
  min-height: 0;

  .text {
    overflow: auto;
    padding: 0.5em;
    border-radius: 0.3em;
    border: 1px solid black;
  }
}
</style>
