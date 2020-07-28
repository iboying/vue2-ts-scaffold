<template lang="pug">
.layout-header
  .layout-header__navbar
    slot(name="nav")
  .layout-header__main
    slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class HeaderLayout extends Vue {}
</script>

<style lang="stylus" scoped>
.layout-header
  position relative
  padding-top 50px
  width 100%
  height 100%
  background #F5F5F5
  .layout-header__navbar
    position absolute
    top 0px
    left 0px
    z-index 1000
    width 100%
  .layout-header__main
    position relative
    overflow auto
    height 100%
</style>
