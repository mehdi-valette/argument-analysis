<template lang="pug">
div.claim-list 
  div.top
    b-list-group
      b-list-group-item(
        v-for="claim in claimList"
        :key="claim.localId"
        ref="claimComponent"
      )
        claim-list-item(:claim="claim")

  div.bottom
    b-button(
      v-b-tooltip.hover
      title="shortcut: Enter"
      @click="getClaim"
      small
      block
      variant="primary"
    ) new
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import { TextClaim, EventBusMessage } from '~/types/seven-steps';
import ClaimListItem from '@/components/IdentificationListItem.vue';

@Component({
  components: {
    ClaimListItem
  }
})
export default class ClaimList extends Vue {
  private claimListCheck: string[] = [];
  private claimReference: Element[] = [];

  get claimList() {
    return this.$store.getters['claim'] as TextClaim[];
  }

  /** trigger IdentificationText to create a new claim  */
  getClaim() {
    const message: EventBusMessage = {
      header: [{emitter: 'claim-list'}],
      payload: {
        claim: {
          translation: {
            default: ''
          },
          logic: {}
        },
        stated: false,
        conclusion: false,
        number: 0,
        localId: '',
        range: []
      } as TextClaim
    }

    this.$bus.$emit(
      'text-claim-add', message
    );
  }
}
</script>

<style lang="scss" scoped>
.claim-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  border: 1px solid black;
  border-radius: .5em;

  .top {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>