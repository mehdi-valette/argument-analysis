import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

import cloneDeep from 'lodash.clonedeep';

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
}
