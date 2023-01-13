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
      {{ price | numberFormat }} ₽
    </span>

    <ProductBtns
      :parentIndex = parentIndex
      :offerValue="offerValue"
      :activeOffer="activeOffer"
      @check="activeOffer = $event"
    />

  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import ProductBtns from '@/components/product/ProductBtns.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'ProductItem',
  components: { ProductBtns },
  props: ['product', 'parentIndex'],
  data() {
    return {
      activeOffer: 0,
      activeColorCode: this.product.colors[0].code,
    };
  },
  filters: { numberFormat },
  computed: {
    offers() {
      return this.product.offers;
    },
    offerValue() {
      const arr = [];
      this.offers.forEach((el) => {
        el.propValues.forEach((elem) => {
          const { value } = elem;
          arr.push(value);
        });
      });
      return arr;
    },
    price() {
      return this.offers[this.activeOffer].price;
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
