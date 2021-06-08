<template lang="pug">
g
  circle(:cx="posX" :cy="posY" :r="length/2" fill="skyblue" stroke="black" :stroke-width="width")
  foreignObject(:x="posX - length/2" :y="posY - length/2" :width="length" :height="length")
    div.circle(:title="text" v-b-tooltip.hover :style="{fontSize: scale.val + 'em'}") {{number}}
</template>

<script lang="ts">
import {Vue, Component, Prop, Inject} from 'vue-property-decorator';

@Component({})
export default class StructureClaim extends Vue {
  @Prop({required: true})
  private readonly position!: {x: number, y: number};

  @Prop({required: true})
  private readonly number!: string;

  @Prop({required: true})
  private readonly text!: string;

  @Inject()
  private readonly scale!: {val: number};

  get posX() {
    return this.position.x * this.scale.val;
  }

  get posY() {
    return this.position.y * this.scale.val;
  }

  get length() {
    return 45 * this.scale.val;
  }

  get width() {
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