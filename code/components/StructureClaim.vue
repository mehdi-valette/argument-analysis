<template lang="pug">
g
  template(v-for="claim, index in claimList")
    circle(:cx="posX(index) + length/2" :cy="posY + length / 2" :r="length/2" fill="skyblue" stroke="black" :stroke-width="thickness")
    foreignObject(:x="posX(index)" :y="posY" :width="length" :height="length")
      div.circle(:title="claim.text" v-b-tooltip.hover :style="{fontSize: scale.val + 'em'}") {{claim.number}}

  line(:x1="position.x - lengthFull / 2" :y1="position.y + length / 2 + margin + thickness" :x2="position.x + lengthFull / 2" :y2="position.y + length / 2 + margin + thickness" stroke="black" :stroke-width="thickness")

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

  // abscisse position of a claim based on its index in the list
  posX(index: number) {
    return this.position.x + (index * this.lengthMargin) - (this.lengthFull / 2);
  }

  get posY() {
    return this.position.y * this.scale.val - this.length / 2;
  }

  get margin() {
    return 1 * this.scale.val;
  }

  // length of the full group of claims
  get lengthFull() {
    return this.lengthMargin * this.claimList.length + this.margin + this.thickness;
  }

  // length of a circle, with margin and border
  get lengthMargin() {
    return this.length + (this.margin * 2) + (this.thickness * 2);
  }

  // length of one circle, without margin or border
  get length() {
    return 45 * this.scale.val;
  }

  // thickness of the line
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