<template>
  <div>
    <section class="catalog">
      <ProductItem :products="products"/>
      <!-- <ProductItem :qwerty="qwerty"/> -->

      <ul class="catalog__pagination pagination">
        <li class="pagination__item">
          <a
            class="pagination__link pagination__link--arrow pagination__link--disabled"
            aria-label="Предыдущая страница">
            <svg width="8" height="14" fill="currentColor">
              <use xlink:href="#icon-arrow-left"></use>
            </svg>
          </a>
        </li>
        <li class="pagination__item">
          <a class="pagination__link pagination__link--current">
            1
          </a>
        </li>
        <li class="pagination__item">
          <a class="pagination__link" href="#">
            2
          </a>
        </li>
        <li class="pagination__item">
          <a class="pagination__link" href="#">
            3
          </a>
        </li>
        <li class="pagination__item">
          <a class="pagination__link" href="#">
            4
          </a>
        </li>
        <li class="pagination__item">
          <a class="pagination__link" href="#">
            ...
          </a>
        </li>
        <li class="pagination__item">
          <a class="pagination__link" href="#">
            10
          </a>
        </li>
        <li class="pagination__item">
          <a
            class="pagination__link pagination__link--arrow"
            href="#"
            aria-label="Следующая страница">
            <svg width="8" height="14" fill="currentColor">
              <use xlink:href="#icon-arrow-right"></use>
            </svg>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import ProductItem from './ProductItem.vue';

export default {
  name: 'ProductList',
  props: ['products'],
  components: {
    ProductItem,
  },
  // data() {
  //   return {
  //     qwerty: this.products,
  //   };
  // },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  .catalog__pic img
    object-fit: contain
</style>
