<template>
  <component
    :is="currentPageComponent"
    :page-params="currentPageParams"
  />
</template>

<script>
import eventBus from '@/eventBus';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const routes = {
  main: 'MainPage',
  product: 'ProductPage',
};

export default {
  name: 'HomeView',
  data() {
    return {
      currentPage: 'main',
      currentPageParams: {},
    };
  },
  components: { MainPage, ProductPage, NotFoundPage },
  computed: {
    currentPageComponent() {
      return routes[this.currentPage] || 'NotFoundPage';
    },
  },
  methods: {
    gotoPage(pageName, pageParams) {
      this.currentPage = pageName;
      this.currentPageParams = pageParams || {};
    },
  },

  created() {
    eventBus.$on('gotoPage', (pageName, pageParams) => this.gotoPage(pageName, pageParams));
  },
};
</script>
