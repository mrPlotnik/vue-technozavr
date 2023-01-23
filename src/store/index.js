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
    orderInfo(state) {
      return state.orderInfo;
    },
    // Получаем информацию о корзине. Вызывается из
    // cartPage.vue
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
    // Вся стоимость конзины. Вызывается из
    // cartPage.vue
    basketTotalPrice(state, getters) {
      return getters.basketProductsDetail.reduce((p, i) => (i.product.price * i.quantity) + p, 0);
    },
    // Всего товаров в корзине. Вызывается из
    // cartPage.vue
    basketTotalProducts(state, getters) {
      return (getters.basketProductsDetail.reduce((p, i) => Number(i.quantity) + p, 0));
    },
  },
  mutations: {
    // Обновляем ключ корзины. Вызывается из
    // App.vue
    // actions.loadBasket()
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },

    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductQuantity(state, { basketItemId, quantity }) {
      const item = state.cartProducts.find((i) => i.basketItemId === basketItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    deleteBasketProduct(state, basketItemId) {
      state.cartProducts = state.cartProducts.filter((item) => item.id !== basketItemId);
    },
    // Обновляем список товаров в корзине (полное описание товаров)
    // Вызывается из
    // actions.loadCart()
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    // Обновляем данные корзины
    // Вызывается из
    // actions.loadCart() и addProductToCart
    syncCartProducts(state) {
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
          // обновляем в state список товаров в корзине (все данные о товарах)
          context.commit('updateCartProductsData', response.data.items);
          // обновляем в state список товаров в корзине
          context.commit('syncCartProducts');
        });
    },

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
    addProductToCart(context, { productOfferId, colorId, quantity }) {
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
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    updateCartProductQuantity(context, { basketItemId, quantity }) {
      context.commit('updateCartProductQuantity', { basketItemId, quantity });
      if (quantity < 1) {
        context.commit('syncCartProducts');
        return null;
      }
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
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => {
          // На всякий случай, если будет ошибка (скорее всего сервера)
          context.commit('syncCartProducts');
        });
    },
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
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .catch(() => {
        });
    },
  },
  modules: {
  },
});
