<template lang="pug">
div.layout
  div.steps
    nuxt-link.step(v-for="step in steps.slice().reverse()" :to="step.href")
      | {{step.text}}
  Nuxt.main
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({})
export default class LayoutDefault extends Vue {
  steps = [
    {text: 'file', href: '/file'},
    {text: 'clarification', href: '/definition'}
  ]
}
</script>

<style lang="scss" scoped>
body {
  .layout {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .main {
      flex-grow: 1;
    }

    .steps {
      display: flex;
      flex-direction: row-reverse;
      justify-content: center;
      flex-grow: 0;

      .step {
        padding: .3em 3em;
        border: 1px solid black;
        border-radius: 2em;
        margin-right: -2em;
        background-color: white;
      }
    }
  }
}
</style>
