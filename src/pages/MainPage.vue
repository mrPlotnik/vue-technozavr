<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info">{{ countProducts }} товара</span>
    </div>

    <div class="content__catalog">

      <!-- Здесь показываем фильтр товаров -->
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :categoryMainPropSlug.sync='filterCategoryMainPropSlug'
        :sku.sync="filterSku"
        @loadProductsByFilters="loadProducts"
        @resetFilters="resetFilters"
      />

      <section class="catalog">

        <!-- Пока выполняется запрос к серверу, показываем прелоадер -->
        <PreLoader v-if="productsLoading"/>

        <!-- Если есть ошибка загрузки данных с сервера -->
        <div v-else-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров<br>
          <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>

        <!-- Здесь показываем все товары -->
        <ProductList
          :products="products"
        />

        <!-- Здесь показываем пагинацию -->
        <BasePagination
          :page.sync="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />

        <!-- Указываем сколько товаров отображать на странице -->
        <div class="catalog__productsPerPage-wrap">
          <span>Количество товаров на странице</span>
          <label for="productsPerPage">
            <select
              id="productsPerPage"
              name="productsPerPage"
              type="text"
              v-model="productsPerPage"
            >
              <option value="3">3</option>
              <option value="9">9</option>
              <option value="12">12</option>
              <option value="18">18</option>
              <option value="24">24</option>
              <option value="27">27</option>
              <option value="32">32</option>
            </select>
          </label>
        </div>

        <!-- <button @click="reduceWay([`https://vue-study.skillbox.cc/api/products/1`,`https://vue-study.skillbox.cc/api/products/2`,`https://vue-study.skillbox.cc/api/products/3`])">123</button> -->

      </section>

    </div>
  </main>
</template>

<script>
import axios from 'axios';
import PreLoader from '@/components/PreLoader.vue';
import ProductFilter from '@/components/filter/ProductFilter.vue';
import ProductList from '@/components/product/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
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

      filterCategoryMainPropSlug: '',
      filterSku: [],

      page: 1,
      productsPerPage: 12,

      productsData: null,
    };
  },
  computed: {
    products() {
      return this.productsData
        // Если this.productsData === true, то возвращаем товары
        ? this.productsData.items.map((prod) => ({
          ...prod,
          // Подмешиваем путь до картинки
          image: prod.preview.file.url,
        }))
        // Если this.productsData === false, то возвращаем пустой массив
        : [];
    },
    countProducts() {
      // Если this.productsData === true, то возвращаем общее количество товаров,
      // Если this.productsData === false, то возвращаем 0
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      // Показываем прелоадер
      this.productsLoading = true;
      // Ошибок загрузки нет
      this.productsLoadingFailed = false;

      // Формируем объект параметров
      const params = {};
      // Если свойство фильтрации = true, добавляем его, чтобы передать в параметры запроса
      if (this.filterPriceFrom) params.minPrice = this.filterPriceFrom;
      if (this.filterPriceTo) params.maxPrice = this.filterPriceTo;
      if (this.filterCategoryId) params.categoryId = this.filterCategoryId;

      // Формируем строку, которая пойдет в query параметры
      let str = '';
      // Если массив не пустой
      if (this.filterSku.length !== 0) {
        this.filterSku.forEach((el, i) => {
          str += `props[${this.filterCategoryMainPropSlug}][]=${el}`;
          // Добавляем амперсанд, если текущий элемент массива не последний
          // Соответственно в конце последнего элемента - не добавляем
          if (i < this.filterSku.length - 1) str += '&';
        });
      }

      // Очищаем таймер
      clearTimeout(this.loadProductsTimer);
      // Оборачиваем запрос в setTimeout, с нулевой задержкой чтобы при фильтрации
      // был один запрос на сервер, а не несколько. Выполнится только последний запрос.
      // this.loadProductsTimer - это свойство экз-ра компонента, а не свойство состояния,
      // там храним идент-р таймера.
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products?${str}`, {
            // Параметры, которые будут передаваться в query-string
            // Берем их из свойств состояния
            params: {
              page: this.page,
              limit: this.productsPerPage,
              ...params,
            },
          })
          .then((response) => {
            this.productsData = response.data;
            // console.log(response.data.items[0].);
          })
          // Если есть ошибка
          .catch(() => {
            this.productsLoadingFailed = true;
          })
          // В конце (в любом случае) отключаем прелоадер и показываем
          // или загруженный список товаров или ошибку загрузки
          .then(() => {
            this.productsLoading = false;
          });
      }, 0);
    },
    resetFilters() {
      this.filterPriceFrom = 0;
      this.filterPriceTo = 0;
      this.filterCategoryId = 0;
      this.filterCategoryMainPropSlug = '';
      this.filterSku = [];
      this.loadProducts();
    },
  },
  watch: {
    // При кликах по пагинации
    page() {
      this.loadProducts();
    },
    // При выборе количества товаров для отображения на странице
    productsPerPage() {
      this.loadProducts();
    },
    // Свойства фильтрации
    // filterCategoryId() {
    //   this.loadProducts();
    // },
    // filterPriceFrom() {
    //   this.loadProducts();
    // },
    // filterPriceTo() {
    //   this.loadProducts();
    // },
  },
  created() {
    this.loadProducts();
  },

};
</script>
