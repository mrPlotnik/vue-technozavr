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

      <!-- Фильтр по цветам -->
      <fieldset class="form__block" v-show="categoryId === 4">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li
            class="colors__item"
            v-for="color in colors"
            :key="color.id"
          >
            <label class="colors__label" :for="`color-filter-${color.id}`">
            <input
              :id="`color-filter-${color.id}`"
              class="colors__radio sr-only"
              type="radio"
              :value="color.id"
              @input="filterByColorClick(color.title)"
              v-model="currentColor"
            >
            <span class="colors__value" :style="{'background-color': color.code}"></span>
            </label>
          </li>
        </ul>
      </fieldset>

      <!-- Фильтр по памяти -->
      <fieldset class="form__block" v-show="categoryId === 1">
        <legend class="form__legend">Объемб в ГБ</legend>
        <ul class="check-list">

          <li class="check-list__item" v-for="(elem, index) in memoryCounter" :key="index">
            <label class="check-list__label" :for="`check-list-${elem.gb}`">
              <input
                :id="`check-list-${elem.gb}`"
                class="check-list__check sr-only"
                type="checkbox"
                name="volume"
                :value="elem.gb"
                @input="filterByMemoryClick(elem.gb)"
                v-model="currentMemory"
              >
              <span class="check-list__desc">
                {{ elem.gb }}GB
                <span>({{ elem.count }})</span>
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
      >
        Сбросить
      </button>

    </form>

  </aside>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  name: 'ProductFilter',
  components: { BaseFormText },
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
    },
    color(value) {
      this.currentColor = value;
    },
    memory(value) {
      this.currentMemory = value;
    },
  },
  methods: {
    submit() {
      this.$emit('loadProductsByFilters');
    },
    reset() {
      this.$emit('resetFilters');
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
    // Загружаем счетчики товаров по памяти
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
    filterByColorClick(e) {
      this.currentColor = e;
      // Двусторонняя привязка
      this.$emit('update:color', this.currentColor);
    },
    filterByMemoryClick(e) {
      // Для удобства
      const arr = this.currentMemory;
      // Если в массиве нет элемента со значением е, то добавляем его
      if (!arr.includes(e)) arr.push(e);
      // А если еть, то удаляем
      else arr.splice(arr.findIndex((el) => el === e), 1);
      // Двусторонняя привязка
      this.$emit('update:memory', this.currentMemory);
    },
    filterByCategoryClick(e) {
      this.currentCategoryId = Number(e);
      // Двусторонняя привязка
      this.$emit('update:categoryId', this.currentCategoryId);
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadCounterByMemory();
  },
};
</script>
