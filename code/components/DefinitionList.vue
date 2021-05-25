<template lang="pug">
div.definition-list 
  div.top
    b-list-group
      b-list-group-item(
        v-for="definition in definitionList"
        :key="definition.localId"
        ref="definitionComponent"
      )
        definition-list-item(:definition="definition")

  div.bottom
    b-button(
      v-b-tooltip.hover
      title="shortcut: Enter"
      @click="getDefinition"
      small
      block
      variant="primary"
    ) new
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import { TextDefinition, EventBusMessage } from '~/types/seven-steps';
import DefinitionListItem from '@/components/DefinitionListItem.vue';

@Component({
  components: {
    DefinitionListItem
  }
})
export default class DefinitionList extends Vue {
  private definitionListCheck: string[] = [];
  private definitionReference: Element[] = [];

  get definitionList() {
    return this.$store.getters['definition'] as TextDefinition[];
  }

  getDefinition() {
    const message: EventBusMessage = {
      header: [{emitter: 'definition-list'}],
      payload: {
        localId: '',
        definition: '',
      }
    }

    this.$bus.$emit(
      'text-definition-add', message
    );
  }
}
</script>

<style lang="scss" scoped>
.definition-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  border: 1px solid black;
  border-radius: .5em;

  .top {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>