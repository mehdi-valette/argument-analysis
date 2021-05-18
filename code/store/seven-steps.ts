import {Module, VuexModule, Mutation} from 'vuex-module-decorators';
import cloneDeep from 'lodash.clonedeep';
import { TextDefinition, TextSelection } from '~/types/seven-steps';

@Module({
    name: '7step',
    stateFactory: true,
    namespaced: false,
})
export default class SevenStep extends VuexModule {
    private _definition: TextDefinition[] = [];

    /** create a new definition */
    @Mutation
    definitionCreate(definition: TextDefinition) {
        this._definition.push(definition);
    }

    /** update the meaning of a definition */
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

    /** remove a definition */
    @Mutation 
    definitionDelete(localId: string) {
      this._definition =
        this._definition.filter(definition =>
          definition.localId !== localId
        );
    }

    /** remove a text-selection from a definition */
    @Mutation 
    definitionTextSelectionDelete(
      {localId, start, end}:
      {localId: string, start: number, end: number}
    ) {
      const definitionList = cloneDeep(this._definition);

      const definition =
        definitionList.find(
          definition =>
            definition.localId === localId
        );

      if(definition !== undefined) {
        definition.range =
          definition.range.filter(range =>
            range.start !== start || range.end !== end
          )

        this._definition = definitionList;
      }
    }

    /** add a text-selection to a definition*/
    @Mutation
    definitionTextSelectionAdd(
      {localId, textSelection}:
      {localId: string, textSelection: TextSelection[]}
    ) {
      const definitionList = cloneDeep(this._definition);
      const definition = definitionList.find(definition =>
        definition.localId === localId
      );

      if(definition !== undefined) {
        definition.range.push(...textSelection);

        this._definition = definitionList;
      }
    }

    /** return all definitions */
    get definition() {
        return cloneDeep(this._definition);
    }
}