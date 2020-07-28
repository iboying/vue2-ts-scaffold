export default [
  {
    path: '/',
    name: 'homeIndex',
    component: () => import(/* webpackChunkName: "homeIndex" */ '@/views/home/Index.vue'),
    meta: {
      title: '首页',
      layout: 'menu',
    },
  },
  {
    path: '/about',
    name: 'homeAbout',
    component: () => import(/* webpackChunkName: "homeAbout" */ '@/views/home/About.vue'),
    meta: {
      title: '关于',
      layout: 'menu',
    },
  },
] as IRoute[];
