<template>
  <div class="home">
    <ProductList :products="products"/>
  </div>
</template>

<script>
// @ is an alias to /src
import products from '../data/products';
import ProductList from '../components/ProductList.vue';

export default {
  name: 'HomeView',
  components: {
    ProductList,
  },
  data() {
    return {
      products,
    };
  },
};
</script>
