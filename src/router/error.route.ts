export default [
  {
    path: '*',
    name: 'notFound',
    component: () => import(/* webpackChunkName: "errorNotFound" */ '@/views/error/NotFound.vue'),
    meta: {
      title: '404',
      layout: 'header',
    },
  },
] as IRoute[];
