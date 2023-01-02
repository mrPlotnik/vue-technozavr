// Так как мы используем модульную систему (vue-cli)
// импортируем Vue и VueRouter
import Vue from 'vue';
import VueRouter from 'vue-router';

// Импортируем компоненты
import MainPage from '@/pages/MainPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';

Vue.use(VueRouter);

// Определяем маршруты
// Каждому маршруту должен соответствовать компонент
const routes = [
  { path: '/', name: 'main', component: MainPage },
  { path: '*', name: 'notFound', component: NotFoundPage },
  { path: '/product/:id', name: 'product', component: ProductPage },
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/order', name: 'order', component: OrderPage },
];

// Создаем экземпляр машрутизатора и передаем ему маршруты
const router = new VueRouter({
  routes,
});

export default router;
