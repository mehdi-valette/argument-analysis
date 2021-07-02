import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';

import cloneDeep from 'lodash.clonedeep';
import { Claim, TextClaim, TextClaimId } from '~/types/seven-steps';
import { RangeDelete, RangeModification } from './function';
import cuid from 'cuid';

@Module({
  name: '7step',
  stateFactory: true,
  namespaced: false,
})
export default class ClaimStore extends VuexModule {
  private _textClaim: { [id: string]: TextClaimId } = {};
  private _textClaimList: string[] = [];

  private _claim: { [id: string]: Claim } = {};

  /** return all claims */
  get textClaim() {
    return this._textClaimList.map((key, index) => {
      // retrieve the text-claim-id
      const textClaim = this._textClaim[key];

      // retrieve the claim based on the text-claim's claimId
      const claim: TextClaim = {
        ...cloneDeep(textClaim),
        claim: this._claim[textClaim.claim],
      };

      // attribute a number to the claim
      claim.number = index + 1;

      return claim;
    });
  }

  /** create a new claim */
  @Mutation
  claimCreate(paramTextClaim: TextClaim) {
    // extract the claim form the text-claim and give it a cuid
    const newClaim = cloneDeep(paramTextClaim.claim);
    newClaim.idLocal = cuid();

    // replace the claim from the text-claim by the cuid of the claim created above
    const newTextClaim: TextClaimId = {
      ...cloneDeep(paramTextClaim),
      claim: newClaim.idLocal,
    };

    // update the state
    this._textClaimList.push(paramTextClaim.idLocal);
    Vue.set(this._claim, newClaim.idLocal, newClaim);
    Vue.set(this._textClaim, paramTextClaim.idLocal, newTextClaim);
  }

  /** update a claim */
  @Mutation
  claimUpdate({ idLocal, newClaim }: { idLocal: string; newClaim: Claim }) {
    const claimFound = this._claim[newClaim.idLocal];
    if (claimFound !== undefined) {
      this._claim[newClaim.idLocal] = newClaim;
    }
  }

  /** update whether the claim is (un)stated and is a conclusion */
  @Mutation
  claimTypeUpdate({
    idLocal,
    stated,
    conclusion,
  }: {
    idLocal: string;
    stated: boolean;
    conclusion: boolean;
  }) {
    const claimFound = this._textClaim[idLocal];

    if (claimFound !== undefined) {
      claimFound.conclusion = conclusion;
      claimFound.stated = stated;
    }
  }

  /** remove a claim */
  @Mutation
  claimDelete(idLocal: string) {
    // remove from the claim list
    const claimId = this._textClaim[idLocal].claim;
    Vue.delete(this._claim, claimId);

    // remove from the text-claim list
    Vue.delete(this._textClaim, idLocal);
    this._textClaimList = this._textClaimList.filter(
      (claimId) => claimId !== idLocal
    );
  }

  /** update a claim range */
  @Mutation
  claimRangeUpdate(payload: RangeModification) {
    this._textClaim[payload.idLocal].range = payload.range;
  }

  /** remove a text-selection from a claim */
  @Mutation
  claimRangeDelete(payload: RangeDelete) {
    this._textClaim[payload.idLocal].range = this._textClaim[
      payload.idLocal
    ].range.filter(
      (range) => range.from !== payload.from || range.to !== payload.to
    );
  }

  /** add a text-selection to a claim*/
  @Mutation
  claimRangeAdd(payload: RangeModification) {
    this._textClaim[payload.idLocal].range.push(...payload.range);
  }
}
