<template lang="pug">
.layout-menu
  .layout-menu__header
    slot(name="nav")
      #nav
        router-link(to="/")
          | Home
        span |
        router-link(to="/about")
          | About
  .layout-menu__main
    .main-menu
      slot(name="menu")
    .main-body
      slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class MenuLayout extends Vue {}
</script>

<style lang="stylus" scoped>
.layout-menu
  padding-top 50px
  width 100%
  height 100%
  background #FFFFFF
  .layout-menu__header
    position absolute
    top 0px
    left 0px
    z-index 1000
    width 100%
    height 50px
  .layout-menu__main
    position relative
    display flex
    overflow auto
    padding 0px 60px
    min-width 1080px
    width 100%
    height 100%
    .main-menu
      position fixed
      top 80px
      left 0px
      bottom 0
      padding 0px 0px 0px 60px
      width 260px
      background #fff
      z-index 999
      overflow-y auto
    .main-body
      padding-top 30px
      padding-left 240px
      width 100%
</style>
