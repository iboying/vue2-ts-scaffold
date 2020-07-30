import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const requireRoute = require.context('.', true, /\.route\.ts$/);
const routes: IRoute[] = [];
let errorRoutes: IRoute[] = [];

requireRoute.keys().forEach(fileName => {
  const moduleRoutes = requireRoute(fileName).default;
  if (Array.isArray(moduleRoutes)) {
    if (fileName.startsWith('./error')) {
      errorRoutes = moduleRoutes;
    } else {
      routes.push(...moduleRoutes);
    }
  }
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes.concat(errorRoutes),
});

export default router;
