<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >

      <!-- Цена -->
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>

        <BaseFormText
          id="filter-from"
          classParent="form__input-wrap--price"
          classLabel="form__label form__label--price"
          classInput="form__input"
          title="От"
          type="text"
          v-model.number="currentPriceFrom"
        />

        <BaseFormText
          id="filter-to"
          classParent="form__input-wrap--price"
          classLabel="form__label form__label--price"
          classInput="form__input"
          title="До"
          type="text"
          v-model.number="currentPriceTo"
        />

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

      <!-- Цвет -->
      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <ProductFilterAllColors
            v-for="color in colors"
            :key="color.id"
            :color="color"
            :activeColor="currentColor"
            @input="currentColor = $event"
          />
        </ul>
      </fieldset>

      <!--  -->

      <fieldset class="form__block">
        <legend class="form__legend">Объемб в ГБ</legend>
          <ProductFilterByMemory
            :memoryCounter="memoryCounter"
            :currentMemory="currentMemory"
            @check="check($event)"
          />
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
      >
        Сбросить
      </button>

    </form>

  </aside>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import ProductFilterAllColors from '@/components/filter/ProductFilterAllColors.vue';
import ProductFilterByMemory from '@/components/filter/ProductFilterByMemory.vue';
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  name: 'ProductFilter',
  components: { BaseFormText, ProductFilterAllColors, ProductFilterByMemory },
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColor: null,
      currentMemory: [],

      memoryCounter: [],

      categoriesData: null,
      colorsData: null,
    };
  },
  props: ['priceFrom', 'priceTo', 'categoryId', 'color', 'memory'],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    color(value) {
      this.currentColor = value;
    },
    // memory(value) {
    //   this.currentMemory = value;
    // },
  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:color', this.currentColor);
      this.$emit('update:memory', this.currentMemory);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:color', null);
      this.$emit('update:memory', []);
    },
    // Загружаем список категорий
    loadCategories() {
      axios.get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => {
          this.categoriesData = response.data;
        });
    },
    // Загружаем список цветов
    loadColors() {
      axios.get(`${API_BASE_URL}/api/colors`)
        .then((response) => {
          this.colorsData = response.data;
        });
    },
    loadCounterByMemory() {
      const memoryArr = [8, 16, 32, 64, 128, 256];
      const arr = [];

      async function fetch(memoryValue) {
        await axios.get(`${API_BASE_URL}/api/products`, {
          params: { 'props[built_in_memory]': [`${memoryValue}GB`] },
        }).then((response) => {
          arr.push({
            gb: memoryValue,
            count: response.data.items.length,
          });
        });
        return new Promise((resolve) => { resolve(); });
      }

      // Серия последовательных запросов
      function reduceWay(callback) {
        memoryArr.reduce((acc, item) => acc
          .then((res) => fetch(item, res)), Promise.resolve())
          .then((result) => { callback(result); });
      }

      // Передаем функцию в колбэк на финише
      reduceWay(() => {
        this.memoryCounter = arr;
      });
    },
    check(e) {
      const arr = this.currentMemory;
      if (!arr.includes(e)) arr.push(e);
      else arr.splice(arr.findIndex((el) => el === e), 1);
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadCounterByMemory();
  },
};
</script>
