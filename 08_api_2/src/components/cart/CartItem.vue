<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :alt="item.product.title"
      >
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        @click.prevent="quantity = xCrement(quantity, false)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <label for="qwe">
        <input
          id="qwe"
          type="text"
          v-model.number="quantity"
          @keypress="onlyNumeric($event)"
          name="count"
        >
      </label>

      <button
        type="button"
        aria-label="Добавить один товар"
        @click.prevent="quantity = xCrement(quantity, true)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ quantity * item.product.price | numberFormat }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.productId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>

</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';
import xCrement from '@/helpers/xCrement';

export default {
  name: 'CartItem',
  filters: { numberFormat },
  props: ['item'],
  computed: {
    quantity: {
      get() {
        return this.item.quantity;
      },
      // при изменении поля
      set(value) {
        this.$store.dispatch('updateCartProductQuantity', { productId: this.item.id, quantity: value });
      },
    },
  },
  methods: {
    ...mapActions({ deleteCartProduct: 'deleteCartProduct' }),
    xCrement,
    deleteProduct(productId) {
      this.deleteCartProduct({ productId });
    },
    // Можно вести только число
    onlyNumeric(e) {
      const num = String.fromCharCode(e.keyCode);
      if (/^\d+$/.test(num)) {
        return false;
      }
      e.preventDefault();
      return true;
    },
  },
};
</script>
