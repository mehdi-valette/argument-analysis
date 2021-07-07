<template lang="pug">
div.claim-list-item-text-selection
  span {{claimRange.text}}
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
    div {{claimRange.text}}
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { TextRange } from '~/types/seven-steps';

import {BIcon, BIconXOctagonFill} from 'bootstrap-vue';

@Component({
  components: {
    BIcon,
    BIconXOctagonFill,
  }
})
export default class ClaimlistItemclaimRange extends Vue {
  @Prop({required: true})
  private readonly claimRange!: TextRange;

  @Prop({required: true})
  private readonly claimId!: string;

  private deleteModalShow: boolean = false;

  deleteText() {
    this.$store.commit(
      'textClaimRangeDelete',
      {
        idLocal: this.claimId,
        from: this.claimRange.from,
        to: this.claimRange.to
      }
    )
  }
}
</script>

<style lang="scss" scoped>
.claim-list-item-text-selection {
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