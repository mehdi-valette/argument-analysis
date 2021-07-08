import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Vue from 'vue';
import cuid from 'cuid';

import { store } from '@/store';
import { Argument, ArgumentId, Claim } from '~/types/interface';
import { ArgumentNotFound, ClaimNotFound } from '~/types/error';

@Module({
  dynamic: true,
  name: 'argument',
  store,
  namespaced: false,
  stateFactory: true,
})
export class ArgumentStore extends VuexModule {
  /** An object containing all arguments
   * {'key': Argument} e.g. {'ckqtvfigm00072463zoubr0oq': {idLocal: 'ckqtvfigm00072463zoubr0oq', premise: [], conclusion: []}}
   */
  private _argument: { [id: string]: ArgumentId } = {};

  /** The array containing the keys of the arguments
   * This array is there to ensure that the order of the arguments is maintained
   */
  private _argumentList: string[] = [];

  private get claimList() {
    return this.context.getters.claims as { [id: string]: Claim };
  }

  /** return all the arguments */
  get argument(): Argument[] {
    const claims = this.claimList;

    return this._argumentList.map((argumentId) => {
      // get the ArgumentId, the premises and the conclusions
      const argument = this._argument[argumentId];
      const premise = argument.premise.map((premiseId) => claims[premiseId]);
      const conclusion = argument.conclusion.map(
        (conclusionId) => claims[conclusionId]
      );

      // return the ArgumentId transformed into a full Argument
      return {
        ...argument,
        premise,
        conclusion,
      };
    });
  }

  /** create a new argument */
  @Mutation
  argumentCreate(argument: ArgumentId) {
    Vue.set(this._argument, argument.idLocal, argument);
    this._argumentList.push(argument.idLocal);
  }

  /** remove an argument */
  @Mutation
  argumentDelete(argumentId: string) {
    Vue.delete(this._argument, argumentId);
    this._argumentList = this._argumentList.filter(
      (argId) => argId !== argumentId
    );
  }

  /** add a conclusion into an argument */
  @Mutation
  argumentConclusionAdd(argumentId: string, claimId: string) {
    // verify the argument exists
    const argument = this.verifyArgumentClaim(argumentId, claimId);

    // add the claim if it is not yet in the argument
    if (!argument.conclusion.includes(claimId)) {
      argument.conclusion.push(claimId);
    }
  }

  /** remove a conclusion from an argument */
  @Mutation
  argumentConclusionDelete(argumentId: string, claimId: string) {
    const argument = this._argument[argumentId];

    if (argument !== undefined) {
      argument.conclusion = argument.conclusion.filter(
        (cId) => cId !== claimId
      );
    }
  }

  /** add a premise into an argument */
  @Mutation
  argumentPremiseAdd(argumentId: string, claimId: string) {
    // get the argument, while verifying both argument and claim exist
    const argument = this.verifyArgumentClaim(argumentId, claimId);

    // add the claim if it is not yet in the argument
    if (!argument.premise.includes(claimId)) {
      argument.premise.push(claimId);
    }
  }

  /** remove a premise from an argument */
  @Mutation
  argumentPremiseDelete(argumentId: string, claimId: string) {
    const argument = this._argument[argumentId];

    if (argument !== undefined) {
      argument.premise = argument.premise.filter((cId) => cId !== claimId);
    }
  }

  /** return an argument, given that both the argument and the claim exist */
  private verifyArgumentClaim(argumentId: string, claimId: string): ArgumentId {
    // verify the argument exists
    const argument = this._argument[argumentId];
    if (argument === undefined) {
      throw new ArgumentNotFound(argumentId);
    }

    // verify the claim exists
    const claim = this.claimList[claimId];
    if (claim === undefined) {
      throw new ClaimNotFound(claimId);
    }

    return argument;
  }
}
