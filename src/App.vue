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

export default {
  components: { Header, Footer },
};
</script>

<style lang="sass">
</style>
