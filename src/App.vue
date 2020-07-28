<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import MenuLayout from '@/layouts/MenuLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HeaderLayout from '@/layouts/HeaderLayout.vue';

@Component({
  components: {
    MenuLayout,
    DefaultLayout,
    HeaderLayout,
  },
})
export default class App extends Vue {
  loading = true;

  @Watch('$route')
  onRouteChanged() {
    document.title = this.$route.meta.title;
  }

  get layout() {
    return `${this.$route.meta.layout || 'default'}-layout`;
  }
  get isKeepAlive() {
    return this.$route.meta.keepAlive;
  }

  created() {
    this.checkAuth();
  }
  async checkAuth() {
    const publicPath: string = process.env.VUE_APP_PUBLIC_PATH as string;
    const realPath = window.location.pathname.substring(
      window.location.pathname.indexOf(publicPath) + publicPath.length,
    );
    const route: IObject = (this.$router as any).match(realPath);
    if (route.path.includes('/login')) {
      this.loading = false;
      return;
    }
    if (route.meta && route.meta.requireAuth === false) {
      this.loading = false;
      return;
    }
    try {
      this.loading = true;
      setTimeout(() => {
        // TODO: check auth token
        this.loading = false;
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  }
}
</script>

<template lang="pug">
#app
  .loading-box(v-if="loading")
    .spin 加载中...
  component(:is="layout" v-else)
    keep-alive(:max="10")
      router-view(v-if="isKeepAlive")
    router-view(v-if="!isKeepAlive")
</template>

<style lang="stylus">
#app
  min-width 1080px
  width 100%
  height 100%
  color #383838
  font-weight 400
  font-family -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  .loading-box
    position relative
    width 100%
    height 100%
    .spin
      position absolute
      top 50%
      left 50%
      margin-top -15px
      margin-left -27px
</style>
