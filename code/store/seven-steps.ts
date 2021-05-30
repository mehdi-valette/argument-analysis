import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import cloneDeep from 'lodash.clonedeep';
import { TextClarification, TextRange } from '~/types/seven-steps';

@Module({
  name: '7step',
  stateFactory: true,
  namespaced: false,
})
export default class SevenStep extends VuexModule {
  private _clarification: TextClarification[] = [];
  private _fileOriginal: File = new File([], '');
  private _textOriginal = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  };
  private _textAnnotated = {};

  @Mutation
  fileOriginalCreate(file: File) {
    this._fileOriginal = file;
  }

  get fileOriginal() {
    return this._fileOriginal;
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

  /** return all clarifications */
  get clarification() {
    return cloneDeep(this._clarification);
  }
}
