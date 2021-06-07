<template lang="pug">
div.structure
  identification-list.list
  structure-container.diagram
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import StructureContainer from '@/components/StructureContainer.vue';
import IdentificationList from '@/components/IdentificationList.vue';

@Component({
  components: {
    StructureContainer,
    IdentificationList
  }
})
export default class Structure extends Vue {

}

</script>

<style lang="scss" scoped>
.structure {
  display: flex;
  flex-direction: row;

  .list {
    flex-grow: 1;
  }

  .diagram {
    flex-grow: 1;
  }
}
</style>