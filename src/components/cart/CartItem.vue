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
      {{ item.product.productOffer.title }}
    </h3>
    <p class="product__info">
      {{ mainPropTitle }}:&nbsp;<span>{{ propValue }}</span>
    </p>
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

      <label :for="`product-quantity-${item.basketItemId}`">
        <input
          :id="`product-quantity-${item.basketItemId}`"
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
      @click.prevent="deleteProduct(item.product.id)"
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
import onlyNumeric from '@/helpers/onlyNumeric';

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
        this.$store.dispatch('updateCartProductQuantity', { basketItemId: this.item.product.id, quantity: value });
      },
    },
    // Название главного свойства товара
    mainPropTitle() {
      return this.item.product.productOffer.product.mainProp.title;
    },
    propValue() {
      const { value } = this.item.product.productOffer.propValues[0];
      return value;
    },
  },
  methods: {
    ...mapActions({ deleteBasketProduct: 'deleteBasketProduct' }),
    xCrement,
    onlyNumeric,
    deleteProduct(basketItemId) {
      this.deleteBasketProduct({ basketItemId });
    },
  },
};
</script>
<style scoped lang="sass">
button
  cursor: pointer
</style>
