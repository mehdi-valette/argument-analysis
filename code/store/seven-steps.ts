import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';

import cloneDeep from 'lodash.clonedeep';
import {
  Claim,
  TextClaim,
  TextClarification,
  TextRange,
} from '~/types/seven-steps';
import {
  rangeAdd,
  RangeDelete,
  rangeDelete,
  RangeModification,
  rangeUpdate,
} from './function';

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
    console.log('store/seven-steps.ts:71');
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
    // this._clarification.find(
    //   (clarification) => clarification.idLocal === idLocal
    // );
    if (clarificationFound !== undefined) {
      clarificationFound.clarification = newClarification;
    }
  }

  /** remove a clarification */
  @Mutation
  clarificationDelete(idLocal: string) {
    Vue.delete(this._clarification, idLocal);
    // this._clarification = this._clarification.filter(
    //   (clarification) => clarification.idLocal !== idLocal
    // );
  }

  /** update a clarification range */
  @Mutation
  clarificationRangeUpdate(payload: RangeModification) {
    const clarificationFound = this._clarification[payload.idLocal];
    if (clarificationFound !== undefined) {
      clarificationFound.range = payload.range;
    }
    // this._clarification = rangeUpdate(this._clarification, payload);
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
    // const newList = rangeDelete(this._clarification, payLoad);
    // if (newList !== null) {
    //   this._clarification = newList;
    // }
  }

  /** add a text-selection to a clarification*/
  @Mutation
  clarificationRangeAdd(payload: RangeModification) {
    const clarificationFound = this._clarification[payload.idLocal];
    if (clarificationFound !== undefined) {
      clarificationFound.range.push(...payload.range);
    }
    // const newList = rangeAdd(this._clarification, payload);
    // if (newList !== null) {
    //   this._clarification = newList;
    // }
  }

  // --------------------- claim/identification

  private _claim: TextClaim[] = [];

  /** return all claims */
  get claim() {
    return cloneDeep(this._claim);
  }

  /** create a new claim */
  @Mutation
  claimCreate(claim: TextClaim) {
    claim.number = this._claim.length + 1;

    this._claim.push(claim);
  }

  /** update a claim */
  @Mutation
  claimUpdate({ idLocal, newClaim }: { idLocal: string; newClaim: Claim }) {
    const claimFound = this._claim.find((claim) => claim.idLocal === idLocal);
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
    const claimFound = this._claim.find((claim) => claim.idLocal === idLocal);

    if (claimFound !== undefined) {
      claimFound.conclusion = conclusion;
      claimFound.stated = stated;
    }
  }

  /** remove a claim */
  @Mutation
  claimDelete(idLocal: string) {
    this._claim = this._claim.filter((claim) => claim.idLocal !== idLocal);
  }

  /** update a claim range */
  @Mutation
  claimRangeUpdate(payload: RangeModification) {
    this._claim = rangeUpdate(this._claim, payload);
  }

  /** remove a text-selection from a claim */
  @Mutation
  claimRangeDelete(payload: RangeDelete) {
    const newList = rangeDelete(this._claim, payload);
    if (newList !== null) {
      this._claim = newList;
    }
  }

  /** add a text-selection to a claim*/
  @Mutation
  claimRangeAdd(payload: RangeModification) {
    const newList = rangeAdd(this._claim, payload);

    if (newList !== null) {
      this._claim = newList;
    }
  }
}
