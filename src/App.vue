<template>
  <div>

    <Header/>
    <!-- компонент, соответствующий маршруту, будет отображаться здесь -->
    <router-view/>
    <Footer/>

  </div>
</template>

<script>
import Header from '@/components/main/TheHeader.vue';
import Footer from '@/components/main/TheFooter.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: { Header, Footer },
  methods: {
    ...mapActions(['loadBasket']),
    ...mapMutations(['updateUserAccessKey']),
  },
  // В хуке created
  created() {
    // Проверяем наличие ключа корзины в localStorage
    const userAccessKey = localStorage.getItem('userAccessKey');
    // Если ключ есть, вызываем мутацию
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    // Загружаем информацио о корзине
    this.loadBasket();
  },
};
</script>
