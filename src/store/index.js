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
    cartProductsDetail(state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData
          .find((p) => p.productOffer.id === item.offerId);
        return {
          ...item,
          product: {
            ...product,
            image: product.productOffer.product.preview.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartProductsDetail.reduce((p, i) => (i.product.price * i.quantity) + p, 0);
    },
    cartTotalProducts(state, getters) {
      return (getters.cartProductsDetail.reduce((p, i) => Number(i.quantity) + p, 0));
    },
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductQuantity(state, { productId, quantity }) {
      const item = state.cartProducts.find((i) => i.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.id !== productId);
    },
    // Обновляем ключ корзины
    // Вызывается из
    // App.vue
    // actions.loadCart()
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
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
      // Оставляем только id и quantity
      state.cartProducts = state.cartProductsData.map((item) => ({
        offerId: item.productOffer.id,
        offerTitle: item.productOffer.title,
        colorId: item.color.color.id,
        quantity: item.quantity,
      }));
    },
  },
  actions: {
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
    // Загружаем данные корзины
    loadCart(context) {
      // Запрос. Берем состав корзины
      return axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          // Если userAccessKey пуст, то
          if (!context.state.userAccessKey) {
            // берем новый ключ из response сервера
            // записываем его в localStorage
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            // и в state
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          // обновляем в state список товаров в корзине (все данные о товарах)
          context.commit('updateCartProductsData', response.data.items);
          // обновляем в state список товаров в корзине (только id и quantity)
          context.commit('syncCartProducts');
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
    updateCartProductQuantity(context, { productId, quantity }) {
      context.commit('updateCartProductQuantity', { productId, quantity });
      if (quantity < 1) {
        context.commit('syncCartProducts');
        return null;
      }
      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId,
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
    deleteCartProduct(context, { productId }) {
      // context.commit('deleteCartProduct', { productId });
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            productId,
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
