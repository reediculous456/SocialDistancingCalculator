import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'long-press-event/dist/long-press-event.min.js';
import '@/plugins/globalComponents';
import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import router from '@/plugins/router';
import toastr from '@/plugins/notifications';
import AppRoot from '@/App';

const errorHandler = function(err) {
  toastr.error(err);
  console.error(err); // eslint-disable-line no-console
};

Vue.config.devtools = true;
Vue.config.errorHandler = errorHandler;

Vue.use(BootstrapVue);

new Vue({
  render: h => h(AppRoot),
  router,
}).$mount(`#app`);
