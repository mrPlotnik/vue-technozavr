<template>

  <ul class="colors colors--black" v-if="mainProp === 7">
    <li class="colors__item" v-for="(offer, i) in offerValue" :key="i">
      <label class="colors__label" :for="`list-${parentIndex}-input-${i}`">
        <input
          class="colors__radio sr-only"
          :id="`list-${parentIndex}-input-${i}`"
          type="radio"
          :value="i"
          :checked="activeOffer === i"
          @click="$emit('check', i)"
        >
        <span class="colors__value checkedItem" :style="{backgroundColor: colorCode[i]}"></span>
      </label>
    </li>
  </ul>

  <ul class="sizes" v-else>
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
  name: 'ProductBtns',
  props: ['parentIndex', 'activeOffer', 'offerValue', 'mainProp', 'colorCode'],
};
</script>

<style lang="sass"></style>
