import Vue from 'vue';
import VueRouter from 'vue-router';
import home from './home.route';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...home],
});

export default router;
