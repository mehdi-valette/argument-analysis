<template lang="pug">
svg(viewBox="0 0 1000 1000").svg
  rect(x="0" y="0" width="1000" height="1000" fill="lightGrey")

  //- line(x1="22" y1="22" x2="122" y2="122" stroke="black" stroke-width="2")
  //- circle(cx="72" cy="72" r="10" fill="white" stroke="black" stroke-width="2")

  structure-link(:from="{x: 30, y: 30, id: 'blabla'}" :to="{x: 100, y: 100, id: 'blablabla'}")

  structure-claim(:position="{x: 30, y: 30}" :number="3" :text="three")

  structure-claim(:position="{x: 100, y: 100}" :number="4" :text="four")
</template>

<script lang="ts">
import {Component, Vue, Provide} from 'vue-property-decorator';
import StructureClaim from '@/components/StructureClaim.vue';
import StructureLink from '@/components/StructureLink.vue';

@Component({
  components: {
    StructureClaim,
    StructureLink,
  }
})
export default class StructureContainer extends Vue {
  @Provide() private scale = 1;
}
</script>

<style lang="scss" scoped>
.svg {
  background-color: grey;
  height: 100%;
  width: 0;
}
</style>