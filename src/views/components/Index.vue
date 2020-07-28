<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ComHelloWorld from '../../components/home/ComHelloWorld.vue';

@Component({
  components: {
    ComHelloWorld,
  },
})
export default class ComponentsIndex extends Vue {}
</script>

<template lang="pug">
.components
  .component
    ComHelloWorld(msg="Hello")
</template>

<style lang="stylus" scoped>
.components
  display grid
  grid-template-columns repeat(3, 1fr)
  gap 10px
  padding 10px
  .component
    box-shadow 0 0 10px 0px rgba(0,0,0,0.2)
    padding 10px
</style>
