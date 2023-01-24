<template>
  <li class="cart__order">

    <div class="cart__order-wrap">
      <h3>
        {{ item.productOffer.title }}
      </h3>
      <span v-if="item.quantity > 1">
        x{{ item.quantity }}
      </span>
      <b>{{ item.quantity * item.productOffer.price | numberFormat }}&nbsp;₽</b>
    </div>

    <span class="cart__article">Артикул: {{ item.productOffer.id }}</span>

  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'OrderItem',
  filters: { numberFormat },
  props: ['item'],
};
</script>
