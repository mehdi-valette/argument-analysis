import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Vue from 'vue';
import { Claim } from '~/types/seven-steps';
import { store } from '@/store';

@Module({
  store,
  dynamic: true,
  name: 'claim',
  namespaced: false,
  stateFactory: true,
})
export default class ClaimStore extends VuexModule {
  private _claim: { [id: string]: Claim } = {};

  get claim() {
    return this._claim;
  }

  /** create a claim */
  @Mutation
  claimCreate(claim: Claim) {
    Vue.set(this._claim, claim.idLocal, claim);
  }

  @Mutation
  claimDelete(claimId: string) {
    Vue.delete(this._claim, claimId);
  }

  /** update a claim */
  @Mutation
  claimUpdate({ idLocal, newClaim }: { idLocal: string; newClaim: Claim }) {
    const claimFound = this._claim[newClaim.idLocal];
    if (claimFound !== undefined) {
      this._claim[newClaim.idLocal] = newClaim;
    }
  }
}
