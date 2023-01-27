<template>
  <li class="cart__item product">

    <!-- Картинка товара -->
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :alt="item.product.title"
      >
    </div>

    <!-- Название товара -->
    <h3 class="product__title">
      {{ item.product.productOffer.title }}
    </h3>

    <!-- Основное свойство товара -->
    <div class="product__info">

      <!-- Цвет для всех товаров, кроме самокатов -->
      <p v-show="mainPropTitle !== 'Цвет'">
        Цвет:&nbsp;<span class="color" :style="{backgroundColor: color}"></span>
      </p>

      <!-- Название основного свойства товара -->
      <p>
        {{ mainPropTitle }}:&nbsp;

        <!-- Показывает цвет, если основное свойство === 'Цвет', т.е. самокат -->
        <span v-show="mainPropTitle === 'Цвет'">
          <span class="color" :style="{backgroundColor: color}"></span>
        </span>

        <!-- Значение основного свойства товара -->
        <span>{{ propValue }}</span>
      </p>

    </div>

    <!-- Артикул -->
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <!-- Изменение количества товаров -->
    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        @click.prevent="decrement"
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

    <!-- Цена товара * количество -->
    <b class="product__price">
      {{ quantity * item.product.price | numberFormat }} ₽
    </b>

    <!-- Кнопка удаления товара -->
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
      // Взять значение поля
      get() {
        return this.item.quantity;
      },
      // При изменении поля
      set(value) {
        // Передаем в экшн
        // id позиции в корзине (не id товара(!)), у которого меняется количество едениц в позиции
        // и новое количество едениц
        this.$store.dispatch('updateBasketProductQuantity', { basketItemId: this.item.product.id, quantity: value });
      },
    },
    // Название основного свойства товара
    mainPropTitle() {
      return this.item.product.productOffer.product.mainProp.title;
    },
    // Значение основного свойства товара
    propValue() {
      const { value } = this.item.product.productOffer.propValues[0];
      return value;
    },
    // Цвет товара (только для самокатов)
    color() {
      return this.item.product.color.color.code;
    },
  },
  methods: {
    ...mapActions({ deleteBasketProduct: 'deleteBasketProduct' }),
    xCrement,
    onlyNumeric,
    // Удаление товара из корзины
    deleteProduct(basketItemId) {
      this.deleteBasketProduct({ basketItemId });
    },
    decrement() {
      if (this.quantity === 1) return;
      this.quantity = xCrement(this.quantity, false);
    },
  },
};
</script>

<style scoped lang="sass">
  button
    cursor: pointer
  .color
    display: flex
    width: 20px
    height: 20px
    border-radius: 50%
    margin-right: 2px
</style>
