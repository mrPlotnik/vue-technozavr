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
            :activeColor="currentActiveColor"
            @input="currentActiveColor = $event"
          />
        </ul>
      </fieldset>

      <!-- другое -->
      <!-- <fieldset class="form__block">
        <legend class="form__legend">Объемб в ГБ</legend>
        <ul class="check-list">
          <li class="check-list__item">
            <label class="check-list__label">
              <input
              class="check-list__check sr-only" type="checkbox" name="volume" value="8" checked="">
              <span class="check-list__desc">
                8
                <span>(313)</span>
              </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="16">
              <span class="check-list__desc">
                16
                <span>(461)</span>
              </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="32">
              <span class="check-list__desc">
                32
                <span>(313)</span>
              </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="64">
              <span class="check-list__desc">
                64
                <span>(313)</span>
              </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="128">
              <span class="check-list__desc">
                128
                <span>(313)</span>
              </span>
            </label>
          </li>
          <li class="check-list__item">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="volume" value="264">
              <span class="check-list__desc">
                264
                <span>(313)</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset> -->

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
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  name: 'ProductFilter',
  components: { ProductFilterAllColors, BaseFormText },
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentActiveColor: null,

      obj: {},

      categoriesData: null,
      colorsData: null,
    };
  },
  props: ['priceFrom', 'priceTo', 'categoryId', 'activeColor'],
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
    priceCategoryId(value) {
      this.currentCategoryId = value;
    },
    activeColor(value) {
      this.currentActiveColor = value;
    },
  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:activeColor', this.currentActiveColor);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:activeColor', null);
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
    loadMemory() {
      const memoryArr = ['8GB', '16GB', '32GB', '64GB', '128GB'];

      function getProductsByMemory(memoryValue, param) {
        axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            'props[built_in_memory]': [`${memoryValue}`],
          },
        });
        // этот вывод в консоль покажет порядок вызовов
        console.log(`Запрос на: ${memoryValue} with params: ${param}`);
        return new Promise((resolve) => { resolve('выполнен'); });
      }

      function reduceWay(callback) {
        memoryArr.reduce((acc, item) => acc
          .then((res) => getProductsByMemory(item, res)), Promise.resolve('1й выполнен'))
          .then((result) => { callback(result); });
      }

      reduceWay((result) => console.log(`Итог: ${result}`));
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMemory();
  },
};
</script>
