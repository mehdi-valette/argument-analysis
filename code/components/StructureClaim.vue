<template lang="pug">
foreignObject(:x="posX" :y="posY" :width="length" :height="length")
  div.circle(:title="text" v-b-tooltip.hover) {{number}}
</template>

<script lang="ts">
import {Vue, Component, Prop, Inject} from 'vue-property-decorator';

@Component({

})
export default class StructureClaim extends Vue {
  @Prop({required: true})
  private readonly position!: {x: number, y: number};

  @Prop({required: true})
  private readonly number!: string;

  @Prop({required: true})
  private readonly text!: string;

  @Inject()
  private readonly scale!: number;

  get posX() {
    return (this.position.x * this.scale) - (this.length / 2);
  }

  get posY() {
    return (this.position.y * this.scale) - (this.length / 2);
  }

  get length() {
    return 45 * this.scale;
  }
}
</script>

<style lang="scss" scoped>
.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px skyblue ridge;
  background-color: skyblue;
  width: 100%;
  height: 100%;
}
</style>