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
import { TextSelection, TextDefinition, BusEvent } from '~/types/seven-steps';
import DefinitionListItem from '@/components/DefinitionListItem.vue';
import {definitionExists} from '@/assets/ts/definition-util';

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
    const message: BusEvent = {
      header: [{emitter: 'definition-list'}],
      payload: {
        localId: '',
        definition: '',
      }
    }

    this.$bus.$emit(
      'text-selection-definition-trigger', message
    );
  }

  mounted() {
    this.$bus.$on('text-selection-definition-response', (message: BusEvent) => {

      // verify that the event was triggered either
      // by this component or by the index page (ENTER key)
      if(!(
        message.header.length > 0 &&
        ['definition-list', 'index'].includes(message.header[0].emitter)
      )) {
        return;
      }

      const  newDefinition = message.payload as TextDefinition;

      if(!definitionExists(this.definitionList, newDefinition)) {
        this.$store.commit('definitionCreate', newDefinition);
      }

    })
  }

  beforeDestroy() {
    this.$bus.$off('text-selection-definition-response');
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