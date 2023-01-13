<template>
  <ul class="sizes">
    <li class="sizes__item" v-for="(offer, i) in offerValue" :key="i">
      <label class="sizes__label" :for="`list-${parentIndex}-input-${i}`">
        <input
          class="sizes__radio sr-only"
          :id="`list-${parentIndex}-input-${i}`"
          type="radio"
          :value="i"
          :checked="activeOffer === i"
          @click="$emit('check', i)"
        >
        <span class="sizes__value">{{ offer }}</span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ProdeuctBtns',
  props: ['parentIndex', 'activeOffer', 'offerValue'],
};
</script>

<style lang="sass"></style>
