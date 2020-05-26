import VueRouter from 'vue-router';
import Vue from 'vue';
import routes from '@/routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: `history`,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || `Social Distancing Calculator`;
  next();
});

router.onError(err => {
  if (err.message === `Forbidden`) {
    router.push(`/error/403`);
  } else {
    router.push(`/error/500/${err.message}`);
  }
});

export default router;
