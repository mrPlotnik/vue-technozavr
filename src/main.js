import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

// Отключает предупреждение о работе в режиме разработки.
Vue.config.productionTip = false;

new Vue({
  router, // Экзепляр маршрутизатора
  store, // Экземпляр состояния приложения
  render: (h) => h(App),
}).$mount('#app');
