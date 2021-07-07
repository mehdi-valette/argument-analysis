import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import Vue from 'vue';

import cloneDeep from 'lodash.clonedeep';
import { Claim, TextClaim, TextClaimId } from '~/types/seven-steps';
import { RangeDelete, RangeModification } from './function';
import { store } from '@/store';
import cuid from 'cuid';

@Module({
  store,
  dynamic: true,
  name: 'text-claim',
  namespaced: false,
  stateFactory: true,
})
export default class TextClaimStore extends VuexModule {
  private _textClaim: { [id: string]: TextClaimId } = {};
  private _textClaimList: string[] = [];

  private get _claimList(): { [id: string]: Claim } {
    return (
      (this.context.getters?.claim as unknown as { [id: string]: Claim }) || {}
    );
  }

  /** return all text-claims */
  get textClaim() {
    return this._textClaimList.map((key, index) => {
      // retrieve the text-claim-id
      const textClaim = this._textClaim[key];

      // retrieve the claim based on the text-claim's claimId
      const claim: TextClaim = {
        ...cloneDeep(textClaim),
        claim: this._claimList[textClaim.claim],
      };

      // attribute a number to the claim
      claim.number = index + 1;

      return claim;
    });
  }

  /** create a new text-claim */
  @Action({ rawError: true })
  async textClaimCreate(paramTextClaim: TextClaim) {
    // extract the claim form the text-claim and give it a cuid
    const newClaim = cloneDeep(paramTextClaim.claim);
    newClaim.idLocal = cuid();

    // replace the claim from the text-claim by the cuid of the claim created above
    const newTextClaim: TextClaimId = {
      ...cloneDeep(paramTextClaim),
      claim: newClaim.idLocal,
    };

    // update the state
    this.context.commit('claimCreate', newClaim);
    this.context.commit('textClaimCreateCallback', newTextClaim);
  }

  @Mutation
  textClaimCreateCallback(newTextClaim: TextClaim) {
    this._textClaimList.push(newTextClaim.idLocal);
    Vue.set(this._textClaim, newTextClaim.idLocal, newTextClaim);
  }

  /** update whether the claim is (un)stated and is a conclusion */
  @Mutation
  textClaimTypeUpdate({
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

  /** remove a text-claim */
  @Action
  textClaimDelete(idLocal: string) {
    // remove from the claim list
    const claimId = (
      (this.context.state as any)._textClaim[idLocal] as TextClaim
    ).claim;
    this.context.commit('claimDelete', claimId);

    // remove from the text-claim list
    this.context.commit('textClaimDeleteCallback', idLocal);
  }

  @Mutation
  textClaimDeleteCallback(idLocal: string) {
    Vue.delete(this._textClaim, idLocal);
    this._textClaimList = this._textClaimList.filter(
      (claimId) => claimId !== idLocal
    );
  }

  /** remove a text-selection from a claim */
  @Mutation
  textClaimRangeDelete(payload: RangeDelete) {
    this._textClaim[payload.idLocal].range = this._textClaim[
      payload.idLocal
    ].range.filter(
      (range) => range.from !== payload.from || range.to !== payload.to
    );
  }

  /** add a text-selection to a claim*/
  @Mutation
  textClaimRangeAdd(payload: RangeModification) {
    this._textClaim[payload.idLocal].range.push(...payload.range);
  }
}
