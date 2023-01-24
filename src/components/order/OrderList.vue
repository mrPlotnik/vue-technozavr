<template>
  <div>
    <div class="cart__block">
      <ul class="cart__orders">

        <OrderItem
          v-for="item in products"
          :key="item.id"
          :item="item"
        />

      </ul>

      <div class="cart__total">
        <p>Доставка: <b>{{ delivery | numberFormat }}&nbsp;₽</b></p>
        <p>Итого:
          <b>{{ totalProducts }}</b>
          товара на сумму
          <b>{{ totalPrice | numberFormat }}&nbsp;₽</b>
        </p>
      </div>

      <slot/>

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
  props: ['products', 'totalPrice', 'totalProducts', 'delivery', 'error'],
  filters: { numberFormat },
  components: { OrderItem },
  data() {
    return {};
  },
};
</script>
