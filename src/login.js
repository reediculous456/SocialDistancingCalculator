import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import LoginRoot from '@/LoginPage';
import toastr from '@/plugins/notifications';

const errorHandler = function(err) {
  toastr.error(err);
  console.error(err); // eslint-disable-line no-console
};

Vue.config.devtools = true;
Vue.config.errorHandler = errorHandler;

new Vue({
  render: h => h(LoginRoot),
}).$mount(`#login-app`);
