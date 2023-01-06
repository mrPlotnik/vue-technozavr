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
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((p, i) => (i.product.price * i.quantity) + p, 0);
    },
    cartTotalProducts(state, getters) {
      return (getters.cartDetailProducts.reduce((p, i) => Number(i.quantity) + p, 0));
    },
  },
  mutations: {
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductQuantity(state, { productId, quantity }) {
      const item = state.cartProducts.find((i) => i.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
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
    // Обновляем данные корзины (только id и quantity)
    // Вызывается из
    // actions.loadCart()
    syncCartProducts(state) {
      // Оставляем только id и quantity
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
    },
  },
  actions: {
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
          // обновляем в state список товаров в корзине (полное описание товаров)
          context.commit('updateCartProductsData', response.data.items);
          // обновляем в state список товаров в корзине (только id и quantity)
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, { productId, quantity }) {
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
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
