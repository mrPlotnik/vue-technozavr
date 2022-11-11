<template>
<main class="content container">
  <div class="content__top content__top--catalog">
    <h1 class="content__title">
      Каталог
    </h1>
    <span class="content__info">
      152 товара
    </span>
  </div>

  <div class="content__catalog">

    <ProductFilter
      :price-from.sync="filterPriceFrom"
      :price-to.sync="filterPriceTo"
      :category-id.sync="filterCategoryId"
      :active-color.sync="activeColor"
    />

    <section class="catalog">

      <ProductList
        :products="products"
      />

      <BasePagination
        :page.sync="page"
        :count="countProducts"
        :per-page="productsPerPage"
      />

    </section>

  </div>
</main>
</template>

<script>
import products from '@/data/products';
import ProductList from '@/components/ProductList.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import BasePagination from '@/components/BasePagination.vue';

export default {
  name: 'HomeView',
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
  },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      page: 1,
      productsPerPage: 3,
      activeColor: null,
    };
  },
  computed: {
    filteredProducts() {
      let fP = products;
      if (this.filterPriceFrom > 0) {
        fP = fP.filter((product) => product.price > this.filterPriceFrom);
      }
      if (this.filterPriceTo > 0) {
        fP = fP.filter((product) => product.price < this.filterPriceTo);
      }
      if (this.filterCategoryId > 0) {
        fP = fP.filter((product) => product.categoryId === this.filterCategoryId);
      }
      if (this.activeColor !== null) {
        fP = fP.filter((p) => p.color.includes(this.activeColor));
      }
      return fP;
    },
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return this.filteredProducts.length;
    },
  },
};
</script>
