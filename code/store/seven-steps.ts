import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';

import cloneDeep from 'lodash.clonedeep';
import {
  Claim,
  TextClaim,
  TextClarification,
  TextRange,
} from '~/types/seven-steps';
import { RangeDelete, RangeModification } from './function';

const refresh = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

@Module({
  name: '7step',
  stateFactory: true,
  namespaced: false,
})
export default class SevenStep extends VuexModule {
  // ------------------- FILE and TEXT
  private _fileOriginal: File = new File([], '');
  private _textOriginal = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  };
  private _textAnnotated = {};

  get fileOriginal() {
    return this._fileOriginal;
  }

  @Mutation
  fileOriginalCreate(file: File) {
    this._fileOriginal = file;
  }

  get textAnnotated() {
    return this._textAnnotated;
  }

  @Mutation
  textOriginalUpdate(text: any) {
    this._textOriginal = cloneDeep(text);
  }

  @Mutation
  textAnnotatedUpdate(text: any) {
    this._textAnnotated = cloneDeep(text);
  }

  get textOriginal() {
    return this._textOriginal;
  }

  // --------------------- clarification

  private _clarification: { [id: string]: TextClarification } =
    Object.create(null);

  /** return all clarifications */
  get clarification() {
    return Object.keys(this._clarification).map(
      (key) => this._clarification[key]
    );
  }

  /** create a new clarification */
  @Mutation
  clarificationCreate(clarification: TextClarification) {
    Vue.set(this._clarification, clarification.idLocal, clarification);
  }

  /** update the meaning of a clarification */
  @Mutation
  clarificationUpdate({
    idLocal,
    newClarification,
  }: {
    idLocal: string;
    newClarification: string;
  }) {
    const clarificationFound = this._clarification[idLocal];
    if (clarificationFound !== undefined) {
      clarificationFound.clarification = newClarification;
    }
  }

  /** remove a clarification */
  @Mutation
  clarificationDelete(idLocal: string) {
    Vue.delete(this._clarification, idLocal);
  }

  /** update a clarification range */
  @Mutation
  clarificationRangeUpdate(payload: RangeModification) {
    const clarificationFound = this._clarification[payload.idLocal];
    if (clarificationFound !== undefined) {
      clarificationFound.range = payload.range;
    }
  }

  /** remove a text-selection from a clarification */
  @Mutation
  clarificationRangeDelete(payload: RangeDelete) {
    const clarificationFound = this._clarification[payload.idLocal];
    if (clarificationFound !== undefined) {
      clarificationFound.range = clarificationFound.range.filter(
        (range) => !(range.from === payload.from && range.to === payload.to)
      );
    }
  }

  /** add a text-selection to a clarification*/
  @Mutation
  clarificationRangeAdd(payload: RangeModification) {
    const clarificationFound = this._clarification[payload.idLocal];
    if (clarificationFound !== undefined) {
      clarificationFound.range.push(...payload.range);
    }
  }

  // --------------------- claim/identification

  private _claim: { [id: string]: TextClaim } = {};
  private _claimList: string[] = [];

  /** return all claims */
  get claim() {
    return this._claimList.map((key, index) => {
      const claim = cloneDeep(this._claim[key]);
      claim.number = index + 1;
      return claim;
    });
  }

  /** create a new claim */
  @Mutation
  claimCreate(claim: TextClaim) {
    this._claimList.push(claim.idLocal);
    Vue.set(this._claim, claim.idLocal, claim);
  }

  /** update a claim */
  @Mutation
  claimUpdate({ idLocal, newClaim }: { idLocal: string; newClaim: Claim }) {
    const claimFound = this._claim[newClaim.idLocal];
    if (claimFound !== undefined) {
      claimFound.claim = newClaim;
    }
  }

  /** update whether the claim (un)stated and is a conclusion */
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
    const claimFound = this._claim[idLocal];

    if (claimFound !== undefined) {
      claimFound.conclusion = conclusion;
      claimFound.stated = stated;
    }
  }

  /** remove a claim */
  @Mutation
  claimDelete(idLocal: string) {
    Vue.delete(this._claim, idLocal);
    this._claimList = this._claimList.filter((claimId) => claimId !== idLocal);
  }

  /** update a claim range */
  @Mutation
  claimRangeUpdate(payload: RangeModification) {
    this._claim[payload.idLocal].range = payload.range;
  }

  /** remove a text-selection from a claim */
  @Mutation
  claimRangeDelete(payload: RangeDelete) {
    this._claim[payload.idLocal].range = this._claim[
      payload.idLocal
    ].range.filter(
      (range) => range.from !== payload.from || range.to !== payload.to
    );
  }

  /** add a text-selection to a claim*/
  @Mutation
  claimRangeAdd(payload: RangeModification) {
    this._claim[payload.idLocal].range.push(...payload.range);
  }
}
