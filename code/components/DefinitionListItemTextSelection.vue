<template lang="pug">
div.definition-list-item-text-selection
  span {{textSelection.text}}
  b-icon.icon-delete(
    v-b-tooltip.hover
    title="delete text"
    icon="x-octagon-fill"
    variant="danger"
    @click="() => deleteModalShow = true"
  )

  b-modal(
    title="Shall we delete the following text?"
    ok-title="delete"
    auto-focus-button="cancel"
    @ok="deleteText"
    v-model="deleteModalShow"
  )
    div {{textSelection.text}}
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { BusEvent, TextSelection } from '~/types/seven-steps';

import {BIcon, BIconXOctagonFill} from 'bootstrap-vue';

@Component({
  components: {
    BIcon,
    BIconXOctagonFill,
  }
})
export default class DefinitionlistItemTextSelection extends Vue {
  @Prop({required: true})
  private readonly textSelection!: TextSelection;

  @Prop({required: true})
  private readonly definitionId!: string;

  private deleteModalShow: boolean = false;

  deleteText() {
    const message: BusEvent = {
      header: [{emitter: 'definition-list-item-range'}],
      payload: {
        from: this.textSelection.from,
        to: this.textSelection.to,
      }
    }

    this.$bus.$emit('text-definition-range-delete', message);
  }
}
</script>

<style lang="scss" scoped>
.definition-list-item-text-selection {
  display: inline-block;
  font-size: 0.8em;
  background-color: #eee;
  border: 0.01em solid black;
  padding: 0.1em 0.5em;
  margin-right: 1em;

  .icon-delete {
    position: absolute;
    margin-top: -0.5em;
    cursor: pointer;
    opacity: 0.8;
  }
  .icon-delete:hover {
    opacity: 1;
  }
}
</style>