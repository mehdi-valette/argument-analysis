import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { store } from '@/store';

import cloneDeep from 'lodash.clonedeep';

@Module({
  dynamic: true,
  store: store,
  name: 'file',
  namespaced: false,
  stateFactory: true,
})
export default class FileStore extends VuexModule {
  // ------------------- FILE and TEXT
  private _file: string = '';
  private _textOriginal = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  };
  private _textAnnotated = {};

  get file() {
    return this._file;
  }

  @Mutation
  fileSave(file: string) {
    this._file = file;
  }

  @Action({ rawError: true })
  async fileCreate(file: File) {
    const commit = this.context.commit;

    const fileReader = new FileReader();

    fileReader.onload = function (evt) {
      if (evt.target !== null) {
        commit('fileSave', evt.target.result);
      }
    };

    fileReader.readAsDataURL(file);
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
