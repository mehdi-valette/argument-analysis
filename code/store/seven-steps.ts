import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import cloneDeep from 'lodash.clonedeep';
import {
  Claim,
  TextClaim,
  TextClarification,
  TextRange,
} from '~/types/seven-steps';

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

  private _clarification: TextClarification[] = [];

  /** return all clarifications */
  get clarification() {
    return cloneDeep(this._clarification);
  }

  /** create a new clarification */
  @Mutation
  clarificationCreate(clarification: TextClarification) {
    this._clarification.push(clarification);
  }

  /** update the meaning of a clarification */
  @Mutation
  clarificationUpdate({
    localId,
    newClarification,
  }: {
    localId: string;
    newClarification: string;
  }) {
    const clarificationFound = this._clarification.find(
      (clarification) => clarification.localId === localId
    );
    if (clarificationFound !== undefined) {
      clarificationFound.clarification = newClarification;
    }
  }

  /** remove a clarification */
  @Mutation
  clarificationDelete(localId: string) {
    this._clarification = this._clarification.filter(
      (clarification) => clarification.localId !== localId
    );
  }

  /** update a clarification range */
  @Mutation
  clarificationRangeUpdate({
    localId,
    range,
  }: {
    localId: string;
    range: TextRange[];
  }) {
    const clarificationList = cloneDeep(this._clarification);
    clarificationList.forEach((clarification) => {
      if (clarification.localId === localId) {
        clarification.range = range;
      }
    });

    this._clarification = clarificationList;
  }

  /** remove a text-selection from a clarification */
  @Mutation
  clarificationRangeDelete({
    localId,
    from,
    to,
  }: {
    localId: string;
    from: number;
    to: number;
  }) {
    const clarificationList = cloneDeep(this._clarification);

    const clarification = clarificationList.find(
      (clarification) => clarification.localId === localId
    );

    if (clarification !== undefined) {
      clarification.range = clarification.range.filter(
        (range) => range.from !== from || range.to !== to
      );

      this._clarification = clarificationList;
    }
  }

  /** add a text-selection to a clarification*/
  @Mutation
  clarificationRangeAdd({
    localId,
    range,
  }: {
    localId: string;
    range: TextRange[];
  }) {
    const clarificationList = cloneDeep(this._clarification);
    const clarification = clarificationList.find(
      (clarification) => clarification.localId === localId
    );

    if (clarification !== undefined) {
      clarification.range.push(...range);

      this._clarification = clarificationList;
    }
  }

  // --------------------- claim/identification

  private _claim: TextClaim[] = [];

  /** return all clarifications */
  get claim() {
    return cloneDeep(this._claim);
  }

  /** create a new clarification */
  @Mutation
  claimCreate(claim: TextClaim) {
    this._claim.push(claim);
  }

  /** update the meaning of a clarification */
  @Mutation
  claimUpdate({ localId, newClaim }: { localId: string; newClaim: Claim }) {
    const claimFound = this._claim.find((claim) => claim.localId === localId);
    if (claimFound !== undefined) {
      claimFound.claim = newClaim;
    }
  }

  /** remove a clarification */
  @Mutation
  claimDelete(localId: string) {
    this._claim = this._claim.filter((claim) => claim.localId !== localId);
  }

  /** update a clarification range */
  @Mutation
  claimRangeUpdate({
    localId,
    range,
  }: {
    localId: string;
    range: TextRange[];
  }) {
    const claimList = cloneDeep(this._claim);
    claimList.forEach((claim) => {
      if (claim.localId === localId) {
        claim.range = range;
      }
    });

    this._claim = claimList;
  }

  /** remove a text-selection from a clarification */
  @Mutation
  claimRangeDelete({
    localId,
    from,
    to,
  }: {
    localId: string;
    from: number;
    to: number;
  }) {
    const claimList = cloneDeep(this._claim);

    const claim = claimList.find((claim) => claim.localId === localId);

    if (claim !== undefined) {
      claim.range = claim.range.filter(
        (range) => range.from !== from || range.to !== to
      );

      this._claim = claimList;
    }
  }

  /** add a text-selection to a clarification*/
  @Mutation
  claimRangeAdd({ localId, range }: { localId: string; range: TextRange[] }) {
    const claimList = cloneDeep(this._claim);
    const claim = claimList.find((claim) => claim.localId === localId);

    if (claim !== undefined) {
      claim.range.push(...range);

      this._claim = claimList;
    }
  }
}
