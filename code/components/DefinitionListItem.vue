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
  definition-list-item-text-selection(
    v-for="range in definition.range"
    :text-selection="range"
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

import { BusEvent, TextDefinition } from '~/types/seven-steps';
import DefinitionListItemTextSelection from
  '@/components/DefinitionListItemTextSelection.vue';
import { definitionExists } from '~/assets/ts/definition-util';
import DefinitionText from './DefinitionText.vue';

@Component({
  components: {
    BIcon,
    BIconXOctagon,
    DefinitionListItemTextSelection,
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
    this.$bus.$emit(
      'text-selection-definition-trigger',
      {
        header: [{emitter: `definition-list-item-${this.definition.localId}`}],
      }
    );
  }

  mounted() {
    if(this.definitionText === '') {
      (this.$refs.definitionInput as any).focus();
    }

    this.$bus.$on('text-selection-definition-response', (message: BusEvent) => {
      // verify this component triggered the event
      if(!(
        message.header.length > 0 &&
        message.header[0].emitter ===
          `definition-list-item-${this.definition.localId}`
      )) {
        return;
      }

      // get the text that was selected
      const newDefinition = message.payload as TextDefinition;

      if(!definitionExists(
        this.$store.getters['definition'] as TextDefinition[],
        newDefinition
      )) {
        this.$store.commit(
          'definitionTextSelectionAdd',
          {
            localId: this.definition.localId,
            textSelection: newDefinition.range
          }
        );
      }
    });
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