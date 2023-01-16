<template>
  <li class="catalog__item">

    <router-link
      class="catalog__pic"
      :to="{name: 'product', params: {id: product.id}}"
    >
      <img :src="product.image" :alt="product.title ">
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ price | numberFormat }} ₽
    </span>

    <ProductBtns
      :parentIndex = parentIndex
      :offerValue="offerValue"
      :activeOffer="activeOffer"
      :mainProp="mainProp"
      :colorCode="colorCode"
      @check="activeOffer = $event"
    />

  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import ProductBtns from '@/components/product/ProductBtns.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'ProductItem',
  components: { ProductBtns },
  props: ['product', 'parentIndex'],
  data() {
    return {
      activeOffer: 0,
    };
  },
  filters: { numberFormat },
  computed: {
    // Всего офферов
    offers() {
      return this.product.offers;
    },
    // Главное свойство товара
    mainProp() {
      return this.product.mainProp.id;
    },
    // Значения офферов
    // Для телефонов память, для самокатов цвет и т.д.
    offerValue() {
      const arr = [];
      this.offers.forEach((el) => {
        el.propValues.forEach((elem) => {
          const { value } = elem;
          arr.push(value);
        });
      });
      return arr;
    },
    // Цена для астивноего оффера
    price() {
      return this.offers[this.activeOffer].price;
    },
    // Цветовой код оффера
    colorCode() {
      // Пляски с бубном, потому что API кривое...
      // Только для категории самокатов (потому что у них цвет - осн. характеристика)
      if (this.mainProp === 7) {
        // Массив. Только название цвета и код цвета
        const arr = [];
        this.product.colors.forEach((el) => {
          // Меняем все ё на е
          const title = this.replaceSimbols('ё', 'е', el.color.title);
          arr.push({ title, code: el.color.code });
        });

        // Если название цветов совпадает - тогда берем код
        const newArr = [];
        this.offerValue.forEach((el) => {
          const index = arr.findIndex((n) => {
            const title = this.replaceSimbols('ё', 'е', n.title);
            return title === el;
          });
          newArr.push(arr[index].code);
        });
        return newArr;
      } return null;
    // На самом деле этоот лишний код нужен лишь для одной единицы товара - самоката с id:6
    // Либо я не понял замысел разработчика API
    },
  },
  methods: {
    gotoPage,
    replaceSimbols(a, b, str) {
      return str.replace(RegExp(`${a}`, 'gi'), `${b}`);
    },
  },
};
</script>

<style scoped lang="sass">
  .catalog__pic img
    object-fit: contain
</style>
