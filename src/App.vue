<template lang="pug">
  #app
    #nav
      router-link(to="/")
        | Home
      span |
      router-link(to="/about")
        | About
    router-view
</template>

<style lang="stylus">
#app
  margin-top 60px
  color #2c3e50
  text-align center
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
