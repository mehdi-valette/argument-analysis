<template lang="pug">
g
  template(v-for="claim, index in claimList")
    circle(:cx="posXIndex(index) + length/2" :cy="posY + length / 2" :r="length/2" fill="skyblue" stroke="grey" :stroke-width="thickness")
    foreignObject(:x="posXIndex(index)" :y="posY" :width="length" :height="length")
      div.circle(:title="claim.text" v-b-tooltip.hover :style="{fontSize: scale.val + 'em'}") {{claim.number}}

  line(:x1="posX" :y1="posYLine" :x2="posX + lengthFull" :y2="posYLine" stroke="black" :stroke-width="thickness")
  line(:x1="posX" :y1="posY + lengthMargin / 1.25" :x2="posX" :y2="posYLine + thickness/2" stroke="black" :stroke-width="thickness")
  line(:x1="posX + lengthFull" :y1="posY + lengthMargin / 1.25" :x2="posX + lengthFull" :y2="posYLine + thickness/2" stroke="black" :stroke-width="thickness")

</template>

<script lang="ts">
import {Vue, Component, Prop, Inject} from 'vue-property-decorator';

@Component({})
export default class StructureClaim extends Vue {
  @Prop({required: true})
  private readonly position!: {x: number, y: number};

  @Prop({required: true})
  private readonly claimList!: {number: number, text: string}[];

  @Inject()
  private readonly scale!: {val: number};

  // left-most position of the claim-group
  get posX() {
    return this.position.x * this.scale.val - this.lengthFull / 2;
  }

  // position of a claim based on its index
  posXIndex(index: number) {
    return this.posX + this.lengthMargin * index + this.margin + this.thickness;
  }

  // top-most position of the claim-group
  get posY() {
    return this.position.y * this.scale.val;
  }

  get posYLine() {
    return this.posY + this.lengthMargin;
  }

  // length of the full group of claims
  get lengthFull() {
    return this.lengthMargin * this.claimList.length + this.margin + this.thickness;
  }

  // length of a circle, with margin and border
  get lengthMargin() {
    return this.length + (this.margin * 2) + this.thickness;
  }

  // margin between claims
  get margin() {
    return 1 * this.scale.val;
  }

  // diameter of one circle, without margin or border
  get length() {
    return 45 * this.scale.val;
  }

  // thickness of the lines/borders
  get thickness() {
    return 2 * this.scale.val;
  }
}
</script>

<style lang="scss" scoped>
.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
</style>