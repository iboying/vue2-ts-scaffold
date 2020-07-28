<template lang="pug">
  .home
    img(alt="Vue logo" src="@/assets/images/logo.png")
    HelloWorld(msg="Welcome to Your Vue.js App")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { exampleStore } from '@/store/modules/example.store';
import ComHelloWorld from '@/components/home/ComHelloWorld.vue';

@Component({
  components: {
    ComHelloWorld,
  },
})
export default class Home extends Vue {
  mounted() {
    exampleStore.init();
    this.fetchData();
  }

  fetchData() {
    exampleStore.index();
  }
}
</script>

<style lang="stylus" scoped>
.container
  background #ffffff
  color #333333
</style>
