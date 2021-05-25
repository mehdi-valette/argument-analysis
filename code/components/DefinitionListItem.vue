<template lang="pug">
div.definition-list-item
  //- button to delete a definition
  b-icon.icon(
    icon="x-octagon"
    v-b-tooltip.hover
    title="delete definition"
    @click="() => this.modalDelete = true"
  )

  //- button to add a text-selection to the definition
  b-icon.icon(
    icon="node-plus"
    v-b-tooltip.hover
    title="add the selected text to the definition"
    @click="addSelection"
  )
  
  //- original text (multiple texts possible)
  definition-list-item-range(
    v-for="range in definition.range"
    :definition-range="range"
    :definition-id="definition.localId"
  )

  //- definition that is given to the text
  b-input(
    @change="definitionUpdate"
    v-model="definitionText"
    size="sm"
    ref="definitionInput"
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
import {BIcon, BIconXOctagon, BIconNodePlus} from 'bootstrap-vue';

import { EventBusMessage, TextDefinition } from '~/types/seven-steps';
import DefinitionListItemRange from
  '~/components/DefinitionListItemRange.vue';
import { definitionExists } from '~/assets/ts/definition-util';
import DefinitionText from './DefinitionText.vue';

@Component({
  components: {
    BIcon,
    BIconXOctagon,
    DefinitionListItemRange,
    BIconNodePlus,
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

  // add the selected text to the definition
  addSelection() {
    const message: EventBusMessage = {
      header: [{emitter: `definition-list-item`}],
      payload: this.definition
    }

    this.$bus.$emit(
      'text-definition-add',
      message
    );
  }

  mounted() {
    if(this.definitionText === '') {
      (this.$refs.definitionInput as any).focus();
    }
  }
}
</script>

<style lang="scss" scoped>
.definition-list-item {
  .icon {
    display: inline-block;
    margin-right: 0.5em;
    cursor: pointer;
    user-select: none;
  }
}
</style>