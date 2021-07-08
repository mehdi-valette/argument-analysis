<template lang="pug">
div.clarification-list 
  div.top
    b-list-group
      b-list-group-item(
        v-for="clarification in clarificationList"
        :key="clarification.idLocal"
        ref="clarificationComponent"
      )
        clarification-list-item(:clarification="clarification")

  div.bottom
    b-button(
      v-b-tooltip.hover
      title="shortcut: Enter"
      @click="getClarification"
      small
      block
      variant="primary"
    ) new
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { TextClarification, EventBusMessage } from '~/types/interface';
import ClarificationListItem from '@/components/ClarificationListItem.vue';

@Component({
  components: {
    ClarificationListItem,
  },
})
export default class ClarificationList extends Vue {
  private clarificationListCheck: string[] = [];
  private clarificationReference: Element[] = [];

  get clarificationList() {
    return this.$store.getters['clarification'] as TextClarification[];
  }

  getClarification() {
    const message: EventBusMessage = {
      header: [{ emitter: 'clarification-list' }],
      payload: {
        idLocal: '',
        clarification: '',
      },
    };

    this.$bus.$emit('text-clarification-add', message);
  }
}
</script>

<style lang="scss" scoped>
.clarification-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  border: 1px solid black;
  border-radius: 0.5em;

  .top {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
