import {Module, VuexModule, Mutation} from 'vuex-module-decorators';
import cloneDeep from 'lodash.clonedeep';
import { TextDefinition } from '~/types/seven-steps';

@Module({
    name: '7step',
    stateFactory: true,
    namespaced: false,
})
export default class SevenStep extends VuexModule {
    private _definition: TextDefinition[] = [];

    @Mutation
    definitionCreate(definition: TextDefinition) {
        this._definition.push(definition);
    }

    @Mutation
    definitionUpdate(
      {localId, newDefinition}:
        {localId: string, newDefinition: string}
    ) {
      const definitionFound =
        this._definition.find(definition =>
          definition.localId === localId
        );
      if(definitionFound !== undefined) {
        definitionFound.definition =
          newDefinition;
      }
    }

    @Mutation 
    definitionDelete(localId: string) {
      this._definition =
        this._definition.filter(definition =>
          definition.localId !== localId
        );
    }

    get definition() {
        return cloneDeep(this._definition);
    }
}