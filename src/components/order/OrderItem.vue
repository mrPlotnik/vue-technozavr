<template>
  <li class="cart__order">

    <div class="cart__order-wrap">
      <h3>
        {{ item.product.title }}
      </h3>
      <span v-if="item.quantity > 1">
        x{{ item.quantity }}
      </span>
      <b>{{ item.product.price * item.quantity }}</b>
    </div>

    <span class="cart__article">Артикул: {{ item.product.id }}</span>

  </li>
</template>

<script>
export default {
  name: 'OrderItem',
  props: ['item'],
};
</script>
