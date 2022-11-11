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
// @ is an alias to /src
import products from '@/data/products';
// import colors from '@/data/colors';
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
      return fP;
    },
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return this.filteredProducts.length;
    },
    // colorsMap() {
    // console.log(products);
    // const arr = [];
    // colors.forEach((el) => {
    //   this.products.color.forEach((el2) => {
    //     if (el2 === el.id) {
    //       const obj = {};
    //       obj.el = el;
    //       obj.color = el.color;
    //       arr.push(obj);
    //     }
    //   });
    // });
    // arr[0].active = true;
    // for (let i = 1; i < arr.length; i += 1) {
    //   arr[i].active = false;
    // }

    //   console.log(colors);
    //   console.log(arr);
    //   return arr;
    // },
  },
};
</script>
