import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'long-press-event/dist/long-press-event.min.js';
import '@/plugins/globalComponents';
import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import router from '@/plugins/router';
import toastr from '@/plugins/notifications';
import AppRoot from '@/App';

Vue.config.devtools = true;
Vue.config.errorHandler = (err) => {
  const { response } = err;
  toastr.error(
    response ? `\n ${response.data.err.message}` : err,
    response ? `Error ${response.status}: ${response.statusText}` : undefined,
  );
  console.error(response ? response : err); // eslint-disable-line no-console
};

Vue.use(BootstrapVue);

new Vue({
  render: h => h(AppRoot),
  router,
}).$mount(`#app`);
