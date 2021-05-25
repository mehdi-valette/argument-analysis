<template lang="pug">
div.index
  definition-text(text="Dans le monde des chauds et doux chaudoudoux,<p>chaque personne reçoit à la naissance <blockquote>un sac magique.</blockquote><p>Bien que le sac semble vide, à chaque fois que sa propriétaire y plonge la main,<p>elle en ressort un chaudoudoux.")
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
export default class Index extends Vue {
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
  padding: 1em;
  align-content: stretch;
  height: 100%;
}
</style>
