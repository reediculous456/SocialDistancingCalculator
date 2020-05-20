import Vue from 'vue';
import { GridLoader } from '@saeris/vue-spinners';
const buttonCheckbox = () => import(`@/components/ButtonCheckbox`);
const datePicker = () => import(`vue-bootstrap-datetimepicker`);
const datatable = () => import(`@/components/Datatable`);

Vue.component(`date-picker`, datePicker);
Vue.component(`grid-loader`, GridLoader);
Vue.component(`datatable`, datatable);
Vue.component(`button-checkbox`, buttonCheckbox);
