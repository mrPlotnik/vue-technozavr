import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import API_BASE_URL from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
  },
  getters: {
    // Получаем информацию о корзине. Вызывается из
    // OrderInfoPage.vue
    orderInfo(state) {
      return state.orderInfo;
    },
    // Получаем информацию о корзине. Вызывается из
    // CartPage.vue
    basketProductsDetail(state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData.find((p) => p.id === item.basketItemId);
        return {
          ...item,
          product: {
            ...product,
            image: product.productOffer.product.preview.file.url,
          },
        };
      });
    },
    // Получаем всю стоимость конзины. Вызывается из
    // CartPage.vue
    basketTotalPrice(state, getters) {
      return getters.basketProductsDetail.reduce((p, i) => (i.product.price * i.quantity) + p, 0);
    },
    // Получаем общее количество товаров в корзине. Вызывается из
    // CartPage.vue
    basketTotalProducts(state, getters) {
      return (getters.basketProductsDetail.reduce((p, i) => Number(i.quantity) + p, 0));
    },
  },
  mutations: {
    // Обновляем ключ корзины. Вызывается из
    // App.vue при загрузке приложения,  actions.loadBasket()
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    // Обновляем заказ в state. Вызывается из
    // OrderPage.vue
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    // Очистка корзины. Вызывается из
    // OrderPage.vue
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateBasketProductQuantity(state, { basketItemId, quantity }) {
      const item = state.cartProducts.find((i) => i.basketItemId === basketItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    deleteBasketProduct(state, basketItemId) {
      state.cartProducts = state.cartProducts.filter((item) => item.id !== basketItemId);
    },
    // Обновляем список товаров корзины в state (полное описание товаров)
    // Вызывается из actions.loadCart(), actions.deleteBasketProduct()
    updateBasketProductsData(state, items) {
      state.cartProductsData = items;
    },
    // Обновляем определенные данные корзины в state
    // Вызывается из
    // actions.loadCart(), action.addProductToCart(),
    // action.updateBasketProductQuantity(), actions.deleteBasketProduct()
    syncBasketProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        basketItemId: item.id,
        offerTitle: item.productOffer.title,
        colorId: item.color.color.id,
        quantity: item.quantity,
      }));
    },
  },
  actions: {
    // Загружаем данные корзины
    // Вызывается из App.vue при загрузке приложения
    loadBasket(context) {
      // Берем состав корзины
      return axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          // Если ключ пустой, то он сгенерируется и отправится в ответе
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          // Если userAccessKey пуст, то
          if (!context.state.userAccessKey) {
            // берем новый ключ из ответа и записываем его в localStorage
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            // и в state
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          // Обновляем список товаров корзины в state (полное описание товаров)
          context.commit('updateBasketProductsData', response.data.items);
          // Обновляем определенные данные корзины в state
          context.commit('syncBasketProducts');
        });
    },
    // Загружаем данные заказа
    // OrderPageInfo.vue
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    addProductToBasket(context, { productOfferId, colorId, quantity }) {
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productOfferId,
          colorId,
          quantity,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          // Обновляем список товаров корзины в state (полное описание товаров)
          context.commit('updateBasketProductsData', response.data.items);
          // Обновляем определенные данные корзины в state
          context.commit('syncBasketProducts');
        });
    },
    // Изменение количества единиц товара в позиции корзины
    // Вызывается из CartItem.vue
    updateBasketProductQuantity(context, { basketItemId, quantity }) {
      // Обновляем данные в state
      context.commit('updateBasketProductQuantity', { basketItemId, quantity });
      // Обновляем данные на сервере
      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          // Обновляем список товаров корзины в state (полное описание товаров)
          context.commit('updateBasketProductsData', response.data.items);
        })
        .catch(() => {
          // Если будет ошибка
        });
    },
    // Удаление товара из корзины
    // Вызывается из CartItem.vue
    deleteBasketProduct(context, { basketItemId }) {
      // context.commit('deleteBasketProduct', { basketItemId });
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            basketItemId,
          },
        })
        .then((response) => {
          // Обновляем список товаров корзины в state (полное описание товаров)
          context.commit('updateBasketProductsData', response.data.items);
          // Обновляем определенные данные корзины в state
          context.commit('syncBasketProducts');
        })
        .catch(() => {
          // Если будет ошибка
        });
    },
  },
  modules: {
  },
});
