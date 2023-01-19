<template>
  <PreLoader v-if="productsLoading"/>

  <main class="content container" v-else-if="productsLoadingFailed">Что-то пошло не так</main>

  <main class="content container" v-else>

    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
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
            <fieldset class="form__block">
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

              <div v-show="productAdded">Товар добавлен в корзину</div>
              <div v-show="productAddSending">Добавляем товар в корзину...</div>

            </div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Оплата и доставка
            </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br>
            Синхронизация со смартфоном<br>
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br>
            Поддержка сторонних приложений<br>
          </p>

          <a href="#">
            Все характеристики
          </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет
            оптимизировать свои велотренировки, сделав их максимально эффективными.
            Wahoo ELEMNT BOLT GPS синхронизируется с датчиками по ANT+, объединяя
            полученную с них информацию. Данные отображаются на дисплее, а также
            сохраняются на смартфоне. При этом на мобильное устройство можно
            установить как фирменное приложение, так и различные приложения
            сторонних разработчиков. Велокомпьютер точно отслеживает местоположение,
            принимая сигнал с целого комплекса спутников. Эта информация позволяет
            смотреть уже преодоленные маршруты и планировать новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный.
            Размеры устройства составляют всего 74,6 x 47,3 x 22,1 мм.
            что не превышает габариты смартфона. Корпус гаджета выполнен
            из черного пластика. На обращенной к пользователю стороне расположен
            дисплей диагональю 56 мм. На дисплей выводятся координаты и скорость, а
            также полученная со смартфона и синхронизированных датчиков информация:
            интенсивность, скорость вращения педалей, пульс и т.д. (датчики
            не входят в комплект поставки). Корпус велокомпьютера имеет степень
            защиты от влаги IPX7. Это означает, что устройство не боится пыли, а
            также выдерживает кратковременное (до 30 минут) погружение в воду на
            глубину не более 1 метра.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import PreLoader from '@/components/PreLoader.vue';
import gotoPage from '@/helpers/gotoPage';
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
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      return { ...this.productData, image: this.productData.preview.file.url };
    },
    category() {
      return this.productData.category;
    },
    offersData() {
      const arr = [];
      this.productData.offers.forEach((el) => {
        el.propValues.forEach((elem) => {
          const obj = {};
          obj.value = elem.value;
          obj.title = el.title;
          obj.id = el.id;
          arr.push(obj);
        });
      });
      return arr;
    },
    colors() {
      const arr = [];

      // Этот кусок дублируется
      if (this.category.id === 4) {
        this.productData.colors.forEach((el) => {
          // Меняем все ё на е
          const title = this.replaceSimbols('ё', 'е', el.color.title);
          arr.push({ title, code: el.color.code });
        });

        const newArr = [];
        this.offersData.forEach((el) => {
          const index = arr.findIndex((n) => {
            const title = this.replaceSimbols('ё', 'е', n.title);
            return title === el;
          });
          newArr.push({ title: arr[index].title, code: arr[index].code });
        });
        return newArr;
      }
      this.productData.colors.forEach((el) => {
        arr.push({ title: el.color.title, code: el.color.code, id: el.color.id });
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
  },
  methods: {
    ...mapActions(['addProductToCart']),
    gotoPage,
    xCrement,
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      if (this.activeColorCode === '') {
        console.log('А цвет?');
      }
      this.addProductToCart({
        productOfferId: this.activeOfferId,
        colorId: this.activeColorCode,
        quantity: this.productAmount,
      })
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
  },
  created() {
    this.loadProducts();
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProducts();
      },
      immediate: true,
    },
  },
};
</script>
