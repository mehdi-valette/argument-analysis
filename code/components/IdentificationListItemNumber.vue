<template lang="pug">
div.identification-list-item-number(
  :id='claimTypeTrigger'
)
  div.number(
    :class="{conclusion: claim.conclusion, stated: claim.stated}"
  ) {{claim.number}}
  
  b-popover(
    trigger='click'
    placement='bottom'
    :target='claimTypeTrigger'
  )
    b-select(
      :options="claimTypeList"
      @change="claimTypeChange"
    )
</template>

<script lang="ts">
import cuid from 'cuid';
import { cloneDeep } from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { TextClaim } from '~/types/interface';

type ClaimType =
  | 'conclusionStated'
  | 'conclusionUnstated'
  | 'premiseStated'
  | 'premiseUnstated';

@Component({})
export default class IdentificationListItemNumber extends Vue {
  @Prop({ required: true })
  private readonly claim!: TextClaim;

  private claimTypeTrigger: string = cuid();

  // list of possible options for claim type
  private claimTypeList = [
    {
      text: 'stated conclusion',
      value: 'conclusionStated',
    },
    {
      text: 'unstated conclusion',
      value: 'conclusionUnstated',
    },
    {
      text: 'stated premise',
      value: 'premiseStated',
    },
    {
      text: 'unstated premise',
      value: 'premiseUnstated',
    },
  ];

  /** update the claim in Vuex */
  claimTypeChange(newType: ClaimType) {
    let conclusion: boolean = false;
    let stated: boolean = true;

    if (newType.includes('conclusion')) {
      conclusion = true;
    }

    if (newType.includes('Unstated')) {
      stated = false;
    }

    this.$store.commit('textClaimTypeUpdate', {
      idLocal: this.claim.idLocal,
      conclusion,
      stated,
    });
  }
}
</script>

<style lang="scss" scoped>
.identification-list-item-number {
  padding: 1em;
  cursor: pointer;

  .number {
    // by default, unstated claims are within parenthesis
    &::before {
      content: '(';
    }
    &::after {
      content: ')';
    }

    // conclusion are in bold
    &.conclusion {
      font-weight: bold;
    }

    // stated claim are not within parenthesis
    &.stated::before {
      content: '';
    }
    &.stated::after {
      content: '';
    }
  }
}
</style>
