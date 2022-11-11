<template>
  <li class="catalog__item">

    <a class="catalog__pic" href="#">
      <img :src="product.image" :alt="product.title ">
    </a>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.price }}
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
import colors from '@/data/colors';
import ProductItemColors from '@/components/ProductItemColors.vue';

export default {
  name: 'ProductItem',
  components: { ProductItemColors },
  props: ['product', 'parentIndex'],
  data() {
    return {
      activeColor: 0,
    };
  },
  computed: {
    colors() {
      return colors;
    },
  },
};
</script>

<style scoped lang="sass">
  .catalog__pic img
    object-fit: contain
</style>
