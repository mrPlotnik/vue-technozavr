import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { message1, message2 } from './data1';
import myName from './data2';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

alert(`${message1} ${message2}`);
alert(myName('Andrey'));
