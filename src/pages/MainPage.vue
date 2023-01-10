<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info">{{ countProducts }} товара</span>
    </div>

    <div class="content__catalog">

      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :active-color.sync="activeColor"
      />

      <section class="catalog">

        <PreLoader v-if="productsLoading"/>

        <div v-else-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров<br>
          <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>

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
import ProductFilter from '@/components/filter/ProductFilter.vue';

import PreLoader from '@/components/PreLoader.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductList from '@/components/product/ProductList.vue';
import axios from 'axios';
import API_BASE_URL from '../config';

export default {
  name: 'MainPage',
  components: {
    ProductFilter, ProductList, BasePagination, PreLoader,
  },
  data() {
    return {
      productsLoading: false,
      productsLoadingFailed: false,

      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      activeColor: null,

      page: 1,
      productsPerPage: 3,

      productsData: null,
    };
  },
  computed: {
    products() {
      // Если this.productsData нет
      return this.productsData
        // Если this.productsData === true, то возвращаем товары
        ? this.productsData.items.map((product) => ({
          ...product,
          // Указываем где брать ссылку на картинку товара
          image: product.image.file.url,
        }))
        // Если this.productsData === false, то возвращаем пустой массив
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      // Показываем прелоадер
      this.productsLoading = true;
      // Ошибок загрузки нет
      this.productsLoadingFailed = false;

      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products`, {
          // Параметры, которые будут передаваться в query-string
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            colorId: this.activeColor,
          },
        })
          .then((response) => {
            this.productsData = response.data;
          })
          .catch(() => {
            this.productsLoadingFailed = true;
          })
          .then(() => {
            this.productsLoading = false;
          });
      }, 0);
    },
  },
  watch: {
    // Следим за page (клики по пагинации)
    page() {
      this.loadProducts();
    },
    // Следим за свойствами фильтрации
    filterCategoryId() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    activeColor() {
      this.loadProducts();
    },
  },

  // В хуке
  created() {
    // выполняем метод
    this.loadProducts();
  },

};
</script>

<style scoped lang="sass">
.loader,
.loader:before,
.loader:after
  width: 2.5em
  height: 2.5em
  -webkit-animation-fill-mode: both
  animation-fill-mode: both
  -webkit-animation: load 1.8s infinite ease-in-out
  animation: load 1.8s infinite ease-in-out

.loader
  color: #000
  font-size: 10px
  margin: 80px auto
  position: relative
  -webkit-transform: translateZ(0)
  -ms-transform: translateZ(0)
  transform: translateZ(0)
  -webkit-animation-delay: -0.16s
  animation-delay: -0.16s

.loader:before,
.loader:after
  content: ''
  position: absolute
  top: 0

.loader:before
  left: -3.5em
  -webkit-animation-delay: -0.32s
  animation-delay: -0.32s

.loader:after
  left: 3.5em

@-webkit-keyframes load
  0%,
  80%,
  100%
    box-shadow: 0 2.5em 0 -1.3em

  40%
    box-shadow: 0 2.5em 0 0

@keyframes load
  0%,
  80%,
  100%
    box-shadow: 0 2.5em 0 -1.3em
  40%
    box-shadow: 0 2.5em 0 0

</style>
