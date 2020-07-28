<template lang="pug">
.layout-default
  slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DefaultLayout extends Vue {}
</script>

<style lang="stylus" scoped>
.layout-default
  position relative
  overflow auto
  width 100%
  height 100%
</style>
