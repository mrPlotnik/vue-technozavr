<template>
  <li class="catalog__item">

    <router-link
      class="catalog__pic"
      :to="{name: 'product', params: {id: product.id}}"
    >
      <img :src="product.image" :alt="product.title ">
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.price | numberFormat }} ₽
    </span>

    <ul class="colors colors--black">
      <ProductItemColors
        v-for="color in product.colors"
        :key="color.id"
        :parentIndex = parentIndex
        :color="color"
        :activeColorCode = activeColorCode
        @input="activeColorCode = $event"
      />
    </ul>
  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import ProductItemColors from '@/components/product/ProductColors.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'ProductItem',
  components: { ProductItemColors },
  props: ['product', 'parentIndex'],
  data() {
    return {
      activeColorCode: this.product.colors[0].code,
    };
  },
  filters: { numberFormat },
  computed: {},
  methods: {
    gotoPage,
  },
};
</script>

<style scoped lang="sass">
  .catalog__pic img
    object-fit: contain
</style>
