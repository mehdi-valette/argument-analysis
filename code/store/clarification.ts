import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';

import { TextClarification } from '~/types/interface';
import { RangeDelete, RangeModification } from './function';
import { store } from '@/store';

@Module({
  store,
  dynamic: true,
  name: 'clarification',
  namespaced: false,
  stateFactory: true,
})
export default class Clarification extends VuexModule {
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
}
