<template lang="pug">
svg(viewBox="0 0 1000 1000").svg
  g(ref="panzoom")
    g
      rect(x="0" y="0" width="1000" height="1000" fill="lightGrey")

      structure-link(:from="{x: 30, y: 30, id: 'blabla'}" :to="{x: 100, y: 100, id: 'blablabla'}")

      structure-claim(:position="{x: 30, y: 30}" :number="3" :text="three")

      structure-claim(:position="{x: 100, y: 100}" :number="4" :text="four")
</template>

<script lang="ts">
import {Component, Vue, Provide} from 'vue-property-decorator';
import StructureClaim from '@/components/StructureClaim.vue';
import StructureLink from '@/components/StructureLink.vue';
import panzoom, {PanZoom} from 'panzoom';

@Component({
  components: {
    StructureClaim,
    StructureLink,
  }
})
export default class StructureContainer extends Vue {
  @Provide()
  private scale = {val: 1};

  mounted() {
    const panzoomElement = this.$refs.panzoom as HTMLElement;
    const panZoomOffset = panzoomElement.getBoundingClientRect();

    const instance: PanZoom = panzoom(this.$refs.panzoom as HTMLElement, {
      bounds: true,
      beforeWheel: (e) => {
        // TODO: find a way to correct the cursor position
      } 
    });
  }
}
</script>

<style lang="scss" scoped>
.svg {
  background-color: grey;
  height: 100%;
  width: 0;
}
</style>