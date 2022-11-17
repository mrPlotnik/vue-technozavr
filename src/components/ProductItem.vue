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
      {{ product.price | numberFormat }}
    </span>

    <ul class="colors colors--black">
      <ProductItemColors
        v-for="(color, index) in product.color"
        :key="color"
        :colorId="color"
        :activeColor="activeColor"
        :parentIndex="parentIndex"
        :childIndex="index"
        @input="activeColor = $event"
      />
    </ul>
  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import colors from '@/data/colors';
import ProductItemColors from '@/components/ProductItemColors.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'ProductItem',
  components: { ProductItemColors },
  props: ['product', 'parentIndex'],
  data() {
    return {
      activeColor: 0,
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    colors() {
      return colors;
    },
  },
  methods: {
    gotoPage,
  },
};
</script>

<style scoped lang="sass">
  .catalog__pic img
    object-fit: contain
</style>
