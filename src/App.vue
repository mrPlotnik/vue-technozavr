<template>
  <div>

    <Header/>
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
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey']),
  },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.loadCart();
  },
};
</script>
