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

        <label class="form__label form__label--price" for="price-from">
          <input
            id="price-from"
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          >
          <span class="form__value">От</span>
        </label>

        <label class="form__label form__label--price" for="price-to">
          <input
            id="price-to"
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
          >
          <span class="form__value">До</span>
        </label>

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
            v-for="color in allColors"
            :key="color.id"
            :colorId="color.id"
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
import categories from '@/data/categories';
import allColors from '@/data/colors';
import ProductFilterAllColors from '@/components/ProductFilterAllColors.vue';

export default {
  name: 'ProductFilter',
  components: { ProductFilterAllColors },
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentActiveColor: null,
    };
  },
  props: [
    'priceFrom',
    'priceTo',
    'categoryId',
    'activeColor',
  ],
  computed: {
    categories() {
      return categories;
    },
    allColors() {
      return allColors;
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
  },
};
</script>
