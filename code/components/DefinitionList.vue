<template lang="pug">
div.definition-list 
  div.top
    b-list-group
      b-list-group-item(v-for="definition in definitionList")
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
import {Vue, Component} from 'vue-property-decorator';
import { TextSelection, TextDefinition } from '~/types/seven-steps';
import DefinitionListItem from '@/components/DefinitionListItem.vue';

@Component({
  components: {
    DefinitionListItem
  }
})
export default class DefinitionList extends Vue {
  get definitionList() {
    return this.$store.getters['definition'] as TextDefinition[];
  }

  getDefinition() {
    this.$bus.$emit('text-selection-definition-get', null);
  }

  mounted() {
    this.$bus.$on('text-selection-definition-response', (newDefinition: TextDefinition) => {

      // aggregate all the ranges in the "definition" database
      const allRange: TextSelection[] = [];
      this.definitionList.forEach(definition => {
        allRange.push(...definition.range)
      });

      // verify if one of the ranges in the new selection
      // overlaps with an existing range
      const overlap = newDefinition.range.find(newRange => {

        // look for a range that overlaps
        const overlappingRange =
          allRange.find(range =>
            !(newRange.end <= range.start || newRange.start >= range.end)
          );
        
        // if overlapping range is not undefined
        // that means we found a range that overlaps
        return overlappingRange !== undefined;
      });

      // add the definition if there's no overlap with an existing range
      if(overlap === undefined) {
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