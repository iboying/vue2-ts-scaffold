export default [
  {
    path: '/components',
    name: 'components',
    component: () => import(/* webpackChunkName: "componentsIndex" */ '@/views/components/Index.vue'),
    meta: {
      title: '组件广场',
    },
  },
] as IRoute[];
