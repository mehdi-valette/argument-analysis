<template lang="pug">
div.clarification-list-item
  //- button to delete a clarification
  b-icon.icon(
    icon="x-octagon"
    v-b-tooltip.hover
    title="delete clarification"
    @click="() => this.modalDelete = true"
  )

  //- button to add a text-selection to the clarification
  b-icon.icon(
    icon="node-plus"
    v-b-tooltip.hover
    title="add the selected text to the clarification"
    @click="addSelection"
  )
  
  //- original text (multiple texts possible)
  clarification-list-item-range(
    v-for="range in clarification.range"
    :key="`${clarification.idLocal}-${range.from}-${range.to}`"
    :clarification-range="range"
    :clarification-id="clarification.idLocal"
  )

  //- clarification that is given to the text
  b-input(
    @change="clarificationUpdate"
    v-model="clarificationText"
    size="sm"
    ref="clarificationInput"
  )

  b-modal(
    v-model="modalDelete"
    @ok="clarificationDelete"
    auto-focus-button="cancel"
    ok-title="delete"
    title="Shall we delete the following clarification?"
  )
    div {{this.clarification.clarification}}
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {BIcon, BIconXOctagon, BIconNodePlus} from 'bootstrap-vue';

import { EventBusMessage, TextClarification } from '~/types/seven-steps';
import ClarificationListItemRange from
  '~/components/ClarificationListItemRange.vue';

@Component({
  components: {
    BIcon,
    BIconXOctagon,
    ClarificationListItemRange,
    BIconNodePlus,
  }
})
export default class ClarificationListItem extends Vue {
  @Prop({required: true})
  private readonly clarification!: TextClarification;

  private modalDelete: boolean = false;

  get clarificationText() {
    return this.clarification.clarification;
  }
  set clarificationText(newClarification: string) {}

  clarificationUpdate(newClarification: string) {
    this.$store.commit('clarificationUpdate', {idLocal: this.clarification.idLocal, newClarification});
  }

  clarificationDelete() {
    this.$store.commit('clarificationDelete', this.clarification.idLocal);
  }

  // add the selected text to the clarification
  addSelection() {
    const message: EventBusMessage = {
      header: [{emitter: `clarification-list-item`}],
      payload: this.clarification
    }

    this.$bus.$emit(
      'text-clarification-add',
      message
    );
  }

  mounted() {
    if(this.clarificationText === '') {
      (this.$refs.clarificationInput as any).focus();
    }
  }
}
</script>

<style lang="scss" scoped>
.clarification-list-item {
  .icon {
    display: inline-block;
    margin-right: 0.5em;
    cursor: pointer;
    user-select: none;
  }
}
</style>