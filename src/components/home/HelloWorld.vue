<template lang="pug">
h3.hello
  | {{ msg }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop({ type: String }) private msg!: string;
}
</script>

<style scoped lang="stylus">
h3
  margin 40px 0 0
</style>
