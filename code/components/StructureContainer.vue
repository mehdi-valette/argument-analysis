<template lang="pug">
svg(viewBox="0 0 1000 1000").svg
  g(ref="panzoom")

    structure-claim(:position="{x: 300, y: 300}" :claimList="[{number: 5, text: 'five'}, {number: 6, text: 'six'}, {number: 7, text: 'seven'}]" :premise="false" :collapse="true" )
    structure-claim(:position="{x: 400, y: 400}" :claimList="[{number: 5, text: 'five'}]" :premise="false" :collapse="true" )
    //- structure-claim(:position="{x: 300, y: 300}" :claimList="[{number: 5, text: 'five'}, {number: 6, text: 'six'}, {number: 7, text: 'seven'}]" :premise="false" :collapse="true" )

    structure-link(:from="{x: 300, y: 300, id: 'blabla'}" :to="{x: 400, y: 400, id: 'blablabla'}")
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
        const offset = {x: e.clientX, y: e.clientY};
        let delta = 1 + (e.deltaY/-1000);
        instance.zoomTo(offset.x, offset.y, delta);
        e.preventDefault();
        return true;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.svg {
  background-color: grey;
  height: 100%;
  width: 50%;
  background: white;
}
</style>