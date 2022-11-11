/* eslint-disable */
<template>
  <li class="catalog__item">

    <a class="catalog__pic" href="#">
      <img :src="product.image" :alt="product.title ">
    </a>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ product.price }}
    </span>

    <ul class="colors colors--black">
      <ProductItemColor
        v-for="(color, value) in filterColors"
        :key="value"
        :colors="color"
        :value="currentColor"
        @input="currentColor = $event"
      >
      </ProductItemColor>
    </ul>
  </li>
</template>

<script>
import colors from '@/data/colors';
import ProductItemColor from '@/components/ProductItemColor.vue';

export default {
  name: 'ProductItem',
  components: { ProductItemColor },
  props: ['product'],
  data() {
    return {
      currentColor: '#000000',
    };
  },
  computed: {
    colors() {
      return colors;
    },
    // Создаю массив объектов вида
    // [ {active: true, color: '#000'}, {active: false, color: '#fff'}, ...]
    filterColors() {
      const arr = [];
      colors.forEach((el) => {
        this.product.color.forEach((el2) => {
          if (el2 === el.id) {
            const obj = {};
            obj.color = el.color;
            arr.push(obj);
          }
        });
      });
      const asd = arr.map((f) => f.color).indexOf(this.currentColor);
      for (let i = 0; i < arr.length; i += 1) {
        arr[i].active = false;
      }
      if (asd !== -1) arr[asd].active = true;
      return arr;
    },
  },
};
</script>

<style scoped lang="sass">
  .catalog__pic img
    object-fit: contain
</style>
