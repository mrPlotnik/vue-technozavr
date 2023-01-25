<template>
  <PreLoader v-if="productsLoading"/>

  <main class="content container" v-else-if="productsLoadingFailed">Что-то пошло не так</main>

  <main class="content container" v-else>

    <!-- Хлебные крошки -->
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link
            class="breadcrumbs__link"
            :to="{name: 'main'}"
          >
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link
            class="breadcrumbs__link"
            :to="{name: 'main', params: {categoryId: category.id}}"
          >
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title}}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">

      <!-- Картинка -->
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="product.image"
            :alt="product.title"
          >
        </div>
      </div>

      <div class="item__info">

        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title"> {{ activeOfferTitle }}</h2>
        <div class="item__form">

          <!-- Форма -->
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <b class="item__price">{{ product.price | numberFormat }} ₽</b>

            <!-- Выбор цвета -->
            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item" v-for="color in colors" :key="color.id">
                  <label class="colors__label" :for="`item-color-${color.id}`">
                    <input
                      :id="`item-color-${color.id}`"
                      class="colors__radio sr-only"
                      type="radio"
                      name="color"
                      :value="color.id"
                      v-model="activeColorCode"
                    >
                    <span class="colors__value" :style="{'background-color': color.code}"></span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <!-- Выбор оффера -->
            <fieldset class="form__block" v-show="category.id !== 4">
              <legend class="form__legend">{{ mainPropTitle }}</legend>
              <ul class="sizes sizes--primery">
                <li class="sizes__item" v-for="(offer, i) in offersData" :key="i">
                  <label class="sizes__label" :for="`item-offer-${i}`">
                    <input
                      :id="`item-offer-${i}`"
                      class="sizes__radio sr-only"
                      type="radio"
                      name="item"
                      :value="offer.id"
                      v-model="activeOfferId"
                    >
                    <span class="sizes__value">{{ offer.value }}</span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <!-- Количество товара и кнопка "В корзину" -->
            <div class="item__row">
              <div class="form__counter">

                <button
                  type="button"
                  aria-label="Убрать один товар"
                  @click.prevent="productAmount = xCrement(productAmount, false)"
                >
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <label class="" :for="'product-count'">
                  <input
                    :id="'product-count'"
                    type="text"
                    value="1"
                    name="count"
                    v-model.number="productAmount"
                  >
                </label>

                <button
                  type="button"
                  aria-label="Добавить один товар"
                  @click.prevent="productAmount = xCrement(productAmount, true)"
                >
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>

              </div>

              <button
                class="button button--primery"
                type="submit"
                :disabled="productAddSending"
                >
                В корзину
              </button>

            </div>

            <div class="message" v-show="productAdded">Товар добавлен в корзину</div>
            <div class="message" v-show="productAddSending">Добавляем товар в корзину...</div>
            <div class="message message--error" v-show="!formValid">{{ message }}</div>

          </form>
        </div>
      </div>

      <div class="item__desc">

        <!-- вкладки -->
        <ul class="tabs">
          <li class="tabs__item"
            v-for="(tab, i) in tabs"
            :key="i"
          >
            <label :for="`tab-input-${i}`">
              <input
                :id="`tab-input-${i}`"
                class="display-none"
                type="radio"
                name="tab"
                :value="i"
                v-model="activeTab"
              >
                <a class="tabs__link" :class="{'tabs__link--current': activeTab === i }">
                  {{ tab }}
                </a>
            </label>
          </li>
        </ul>

        <!-- Описание -->
        <div class="item__content" v-show="activeTab === 0">
          <p v-for="item in specifications" :key="item.id">
            {{ item.title }}:&nbsp;{{ item.value }}
          </p>
        </div>

        <!-- Заголовки -->
        <div class="item__content" v-show="activeTab === 1">
          <p></p>
        </div>

        <!-- Гарантия -->
        <div class="item__content" v-show="activeTab === 2">
          <p>
            Срок гарантии: 1 год
          </p>
        </div>

        <!-- Оплата и доставка -->
        <div class="item__content" v-show="activeTab === 3">
          <h3>Самовывоз</h3>
          <p>Бесплатно. Данную опцию Вы сможете выбрать при оформлении заказа.</p>
          <h3>Курьером</h3>
          <p>
            Цена доставки курьером составляет 500 рублей.
            Данную опцию Вы сможете выбрать при оформлении заказа.
            Доставка будет включена в стоимость.
          </p>

        </div>

      </div>

    </section>

  </main>
</template>

<script>
import PreLoader from '@/components/PreLoader.vue';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { mapActions } from 'vuex';
import xCrement from '@/helpers/xCrement';
import API_BASE_URL from '../config';

export default {
  name: 'ProductPage',
  components: { PreLoader },
  data() {
    return {
      productAmount: 1,
      productData: [],
      productsLoading: true,
      productsLoadingFailed: false,
      productAdded: false,
      productAddSending: false,
      activeColorCode: '',
      activeOfferId: '',
      offerTitleDefault: '',
      message: '',
      tabs: ['Описание', 'Характеристики', 'Гарантия', 'Оплата и доставка'],
      activeTab: 0,
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    // Текущий товар с URL картики
    product() {
      return { ...this.productData, image: this.productData.preview.file.url };
    },
    // Данные категории
    category() {
      return this.productData.category;
    },
    // Офферы данного товара
    offersData() {
      const arr = [];
      this.productData.offers.forEach((e) => {
        e.propValues.forEach((elem) => {
          const obj = {};
          obj.value = elem.value;
          obj.title = this.replaceSimbols('ё', 'е', e.title);
          obj.id = e.id;
          arr.push(obj);
        });
      });

      if (this.category.id === 4) {
        arr.forEach((el, i) => {
          const colorInfo = this.productData.colors
            .find((elem) => {
              const colorTitle = this.replaceSimbols('ё', 'е', elem.color.title);
              const colorOfferValue = this.replaceSimbols('ё', 'е', el.value);
              return colorTitle === colorOfferValue;
            });
          arr[i].colorInfo = colorInfo.color;
        });
      }
      return arr;
    },
    // Цвета оффера
    colors() {
      const arr = [];

      // Для самокатов
      if (this.category.id === 4) {
        this.offersData.forEach((e) => {
          arr.push(e.colorInfo);
        });
        return arr;
      }

      // Для всех остальных товаров
      this.productData.colors.forEach((el) => {
        arr.push({
          title: el.color.title,
          code: el.color.code,
          id: el.color.id,
        });
      });
      return arr;
    },
    // Название главного свойства товара
    mainPropTitle() {
      return this.product.mainProp.title;
    },
    // Название активного оффера
    activeOfferTitle() {
      return this.activeOfferId !== ''
        ? this.offersData.find((e) => e.id === this.activeOfferId).title
        : this.offerTitleDefault;
    },
    formValid() {
      if (this.category.id !== 4) {
        return !(this.activeColorCode === '' || this.activeOfferId === '');
      }

      return this.activeColorCode !== '';
    },
    specifications() {
      return this.productData.specifications;
    },
  },
  methods: {
    ...mapActions(['addProductToBasket']),
    xCrement,
    addToCart() {
      this.message = '';

      if (this.activeColorCode === '') {
        this.message += 'Выберите Цвет';
        return;
      }

      // У самокатов не выбираем оффер
      if (this.category.id !== 4) {
        if (this.activeOfferId === '') {
          this.message = `Выберите ${this.mainPropTitle.toLowerCase()}`;
          return;
        }
      }

      this.productAdded = false;
      this.productAddSending = true;

      const paramObj = {};

      if (this.category.id === 4) {
        paramObj.productOfferId = this.offersData
          .find((e) => e.colorInfo.id === this.activeColorCode).id;
      } else {
        paramObj.productOfferId = this.activeOfferId;
      }

      paramObj.colorId = this.activeColorCode;
      paramObj.quantity = this.productAmount;

      this.addProductToBasket({ ...paramObj })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        });
    },
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      axios(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((response) => {
          this.productData = response.data;
          this.offerTitleDefault = response.data.title;
        })
        .catch(() => {
          this.productsLoadingFailed = true;
        })
        .then(() => {
          this.productsLoading = false;
        });
    },
    replaceSimbols(a, b, str) {
      return str.replace(RegExp(`${a}`, 'gi'), `${b}`);
    },
    qwe(i) {
      this.activeTab = i;
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProducts();
      },
      // коллбэк будет вызван сразу же после начала наблюдения
      immediate: true,
    },
  },
};
</script>

<style scoped lang="sass">
  .message
    padding: 5px 0
  .message--error
    color: red
  .img
    height: unset

  .tabs__link
    cursor: pointer
  .display-none
    display: none
</style>
