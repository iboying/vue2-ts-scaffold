<template lang="pug">
  .home
    img(alt="Vue logo" src="@/assets/logo.png")
    HelloWorld(msg="Welcome to Your Vue.js App")
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>

<style lang="stylus" scoped>
.container
  background #ffffff
  color #333333
</style>
