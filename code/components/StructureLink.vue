<template lang="pug">
g
  line(:x1="fromScaled.x" :y1="fromScaled.y" :x2="toScaled.x" :y2="toScaled.y" stroke="black" :stroke-width="width")
  circle(:cx="center.x" :cy="center.y" :r="radius" fill="white" stroke="black" :stroke-width="width")
</template>

<script lang="ts">
import {Vue, Component, Prop, Inject} from 'vue-property-decorator';

@Component({})
export default class StructureLink extends Vue {
  @Prop({required: true})
  private readonly from!: {x: number, y: number, id: string};

  @Prop({required: true})
  private readonly to!: {x: number, y: number, id: string};

  @Inject()
  private readonly scale!: {val: number};

  get fromScaled() {
    return {
      x: this.from.x * this.scale.val,
      y: this.from.y * this.scale.val,
    };
  }

  get toScaled() {
    return {
      x: this.to.x * this.scale.val,
      y: this.to.y * this.scale.val,
    };
  }

  get center() {
    return {
      x: (this.fromScaled.x + this.toScaled.x) / 2,
      y: (this.fromScaled.y + this.toScaled.y) / 2,
    }
  }

  get radius() {
    return 10 * this.scale.val;
  }

  get width() {
    return 2 * this.scale.val;
  }
}
</script>

<style lang="scss" scoped>
</style>