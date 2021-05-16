<template lang="pug">
div.index
  definition-text(text="Dans le monde des chauds et doux chaudoudoux, chaque personne reçoit à la naissance un sac magique. Bien que le sac semble vide, à chaque fois que sa propriétaire y plonge la main, elle en ressort un chaudoudoux.")
  definition-list
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DefinitionText from '~/components/DefinitionText.vue';
import DefinitionList from '~/components/DefinitionList.vue';

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

  keyboardHandler(event) {
    if(event.key === "Enter" && event.ctrlKey === false) {
      this.$bus.$emit('text-selection-definition-get', null);
    } else if(
      event.key ==="Enter" && event.ctrlKey === true
    ) {
        this.$bus.$emit('text-selection-definition-mode-toggle', null);
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
