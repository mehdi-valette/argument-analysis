<template lang="pug">
div.claim-list-item
  div.number
    identification-list-item-number(:claim="claim")

  div.claim
    //- button to delete a claim
    b-icon.icon(
      icon="x-octagon"
      v-b-tooltip.hover
      title="delete claim"
      @click="() => this.modalDelete = true"
    )

    //- button to add a text-selection to the claim
    b-icon.icon(
      icon="node-plus"
      v-b-tooltip.hover
      title="add the selected text to the claim"
      @click="addSelection"
    )
    
    //- original text (multiple texts possible)
    identification-list-item-range(
      v-for="range in claim.range"
      :key="`${claim.idLocal}-${range.from}-${range.to}`"
      :claim-range="range"
      :claim-id="claim.idLocal"
    )

    //- claim that is given to the text
    b-input(
      @change="claimUpdate"
      v-model="claimText"
      size="sm"
      ref="claimInput"
    )

  b-modal(
    v-model="modalDelete"
    @ok="claimDelete"
    auto-focus-button="cancel"
    ok-title="delete"
    title="Shall we delete the following claim?"
  )
    div {{this.claim.claim}}
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {BIcon, BIconXOctagon, BIconNodePlus} from 'bootstrap-vue';
import cloneDeep from 'lodash.clonedeep';

import { EventBusMessage, TextClaim } from '~/types/seven-steps';
import IdentificationListItemRange from
  '~/components/IdentificationListItemRange.vue';
import IdentificationListItemNumber from
  '@/components/IdentificationListItemNumber.vue';

@Component({
  components: {
    BIcon,
    BIconXOctagon,
    BIconNodePlus,
    IdentificationListItemRange,
    IdentificationListItemNumber,
  }
})
export default class ClaimListItem extends Vue {
  @Prop({required: true})
  private readonly claim!: TextClaim;

  private modalDelete: boolean = false;

  get claimText() {
    return this.claim.claim.translation.default;
  }
  set claimText(newClaim: string) {}

  claimUpdate(newDefaultText: string) {
    const newClaim = cloneDeep(this.claim.claim);
    newClaim.translation.default = newDefaultText;
    this.$store.commit('claimUpdate', {idLocal: this.claim.idLocal, newClaim});
  }

  claimDelete() {
    this.$store.commit('claimDelete', this.claim.idLocal);
  }

  // add the selected text to the claim
  addSelection() {
    const message: EventBusMessage = {
      header: [{emitter: `claim-list-item`}],
      payload: this.claim
    }

    this.$bus.$emit(
      'text-claim-add',
      message
    );
  }

  mounted() {
    if(this.claimText === '') {
      (this.$refs.claimInput as any).focus();
    }
  }
}
</script>

<style lang="scss" scoped>
.claim-list-item {
  display: flex;
  align-items: center;

  .number {
    border-right: 1px solid black;
    align-self: stretch;
    display: flex;
    align-items: center;
    margin-right: 1em;
  }

  .claim {
    flex-grow: 1;

    .icon {
      display: inline-block;
      margin-right: 0.5em;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>