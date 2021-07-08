<template lang="pug">
div.clarification-list-item-text-selection
  span {{clarificationRange.text}}
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
    div {{clarificationRange.text}}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { TextRange } from '~/types/interface';

import { BIcon, BIconXOctagonFill } from 'bootstrap-vue';

@Component({
  components: {
    BIcon,
    BIconXOctagonFill,
  },
})
export default class ClarificationlistItemclarificationRange extends Vue {
  @Prop({ required: true })
  private readonly clarificationRange!: TextRange;

  @Prop({ required: true })
  private readonly clarificationId!: string;

  private deleteModalShow: boolean = false;

  deleteText() {
    this.$store.commit('clarificationRangeDelete', {
      idLocal: this.clarificationId,
      from: this.clarificationRange.from,
      to: this.clarificationRange.to,
    });
  }
}
</script>

<style lang="scss" scoped>
.clarification-list-item-text-selection {
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
