<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >

      <!-- Цена от -->
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>

        <div class="form__input-wrap--price">
          <label class="form__label form__label--price" for="filter-from">
            <input
              id="filter-from"
              class="form__input"
              type="text"
              v-model.number="currentPriceFrom"
              @input="priceFromClick($event.target.value)"
            >
            <span class="form__value">От</span>
          </label>
        </div>

        <!-- Цена до -->
        <div class="form__input-wrap--price">
          <label class="form__label form__label--price" for="filter-to">
            <input
              id="filter-to"
              class="form__input"
              type="text"
              v-model.number="currentPriceTo"
              @input="priceToClick($event.target.value)"
            >
            <span class="form__value">До</span>
          </label>
        </div>

      </fieldset>

      <!-- Категория -->
      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select" for="category">
          <select
            id="category"
            class="form__select"
            type="text"
            name="category"
            v-model.number="currentCategoryId"
            @input="filterByCategoryClick($event.target.value)"
          >
            <option value="0">Все категории</option>
            <option
              v-for="category in categories"
              :value="category.id"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <!-- Фильтр по SKU -->
      <fieldset class="form__block">
        <legend class="form__legend">{{ currentCategoryMainProp }}</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="(elem, index) in currentCategoryData" :key="index">
            <label class="check-list__label" :for="`check-list-${elem.value}`">
              <input
                :id="`check-list-${elem.value}`"
                class="check-list__check sr-only"
                type="checkbox"
                name="volume"
                :value="elem.value"
                @input="skuClick(elem.value)"
              >
              <span class="check-list__desc">
                {{ elem.value }}
                <span>({{ elem.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <!-- Кнопка применить -->
      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>

      <!-- Кнопка сбросить -->
      <button
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
        v-show="categoryId !== 0 || priceTo !== 0 || priceFrom !== 0"
      >
        Сбросить
      </button>

    </form>

  </aside>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  name: 'ProductFilter',
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,

      currentSku: [],

      currentCategoryMainProp: '',
      currentCategoryMainPropSlug: '',
      currentCategoryData: [],

      categoriesData: [],
    };
  },
  props: ['priceFrom', 'priceTo', 'categoryId', 'categoryMainPropSlug', 'sku'],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
  },
  watch: {
    // Например после ресета, галочки не убирались.
    // Обновляем данные
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
      if (value !== 0) this.loadCategoryIdData(value);
    },
    categoryMainPropSlug(value) {
      this.currentCategoryMainPropSlug = value;
    },
    sku(value) {
      this.currentSku = value;
    },
  },
  methods: {
    submit() {
      this.$emit('loadProductsByFilters');
    },
    reset() {
      this.$emit('resetFilters');
      this.currentCategoryMainProp = '';
      this.currentCategoryMainPropSlug = '';
      this.currentCategoryData = [];
    },
    // Загружаем список категорий
    loadCategories() {
      axios.get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => {
          this.categoriesData = response.data;
        });
    },
    // Загружаем SKU данные
    loadCategoryIdData(id) {
      axios.get(`${API_BASE_URL}/api/productCategories/${id}`)
        .then((response) => {
          this.currentCategoryData = response.data.productProps[0].availableValues;
          this.currentCategoryMainProp = response.data.productProps[0].title;
          // Двусторонняя привязка
          this.$emit('update:categoryMainPropSlug', response.data.productProps[0].code);
        });
    },
    // Поведение при выборе категории
    filterByCategoryClick(e) {
      this.$emit('update:categoryId', Number(e));
    },
    // Поведение при кликах на фильтрах SKU
    skuClick(e) {
      // Для удобства
      const arr = this.currentSku;
      // Если в массиве нет элемента со значением е, то добавляем его
      if (!arr.includes(e)) arr.push(e);
      // А если еть, то удаляем
      else arr.splice(arr.findIndex((el) => el === e), 1);
      // Двусторонняя привязка
      this.$emit('update:sku', this.currentSku);
    },
    // Поведение при вводе цены от
    priceFromClick(e) {
      this.$emit('update:priceFrom', Number(e));
    },
    // Поведение при вводе цены до
    priceToClick(e) {
      this.$emit('update:priceTo', Number(e));
    },
  },
  created() {
    this.loadCategories();
  },
};
</script>
