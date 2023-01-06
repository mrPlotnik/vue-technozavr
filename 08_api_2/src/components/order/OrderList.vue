<template>
  <div>
    <div class="cart__block">
      <ul class="cart__orders">

        <OrderItem
          v-for="item in products"
          :key="item.productId"
          :item="item"
        />

      </ul>

      <div class="cart__total">
        <p>Доставка: <b>500 ₽</b></p>
        <p>Итого:
          <b>{{ totalProducts }}</b>
          товара на сумму
          <b>{{ totelPrice | numberFormat }} ₽</b>
        </p>
      </div>

      <button class="cart__button button button--primery" type="submit">
        Оформить заказ
      </button>
    </div>

    <div class="cart__error form__error-block" v-if="error">
      <h4>Заявка не отправлена!</h4>
      <p>{{ error }}</p>
    </div>

  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import OrderItem from './OrderItem.vue';

export default {
  name: 'OrderList',
  props: ['products', 'totelPrice', 'totalProducts', 'error'],
  filters: { numberFormat },
  components: { OrderItem },
  data() {
    return {};
  },
};
</script>
