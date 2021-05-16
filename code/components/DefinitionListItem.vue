<template lang="pug">
div.definition-list-item
  //- button to delete a definition
  div.button-delete(
    v-b-tooltip.hover
    title="delete definition"
    @click="() => this.modalDelete = true"
  )
    b-icon(icon="x-octagon")
  
  //- original text (multiple texts possible)
  div.pill(v-for="range in definition.range") {{range.text}}

  //- definition that is given to the text
  b-input(
    @change="definitionUpdate"
    v-model="definitionText"
    size="sm"
  )

  b-modal(
    v-model="modalDelete"
    @ok="definitionDelete"
    auto-focus-button="cancel"
    ok-title="delete"
    title="Shall we delete the following definition?"
  )
    div {{this.definition.definition}}
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {BIcon, BIconXOctagon} from 'bootstrap-vue';

import { TextDefinition } from '~/types/seven-steps';

@Component({
  components: {
    BIcon,
    BIconXOctagon
  }
})
export default class DefinitionListItem extends Vue {
  @Prop({required: true})
  private readonly definition!: TextDefinition;

  private modalDelete: boolean = false;

  get definitionText() {
    return this.definition.definition;
  }
  set definitionText(newDefinition: string) {}

  definitionUpdate(newDefinition: string) {
    this.$store.commit('definitionUpdate', {localId: this.definition.localId, newDefinition});
  }

  definitionDelete() {
    this.$store.commit('definitionDelete', this.definition.localId);
  }
}
</script>

<style lang="scss" scoped>
.definition-list-item {
  .button-delete {
    display: inline-block;
    margin-right: 0.5em;
    cursor: pointer;
  }

  .pill {
    display: inline-block;
    font-size: 0.8em;
    background-color: #eee;
    border: 0.01em solid black;
    padding: 0.1em 0.5em;
  }
}
</style>