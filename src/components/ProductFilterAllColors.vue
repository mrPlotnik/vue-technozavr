<template>
  <li class="colors__item">
    <label class="colors__label" :for="'color_filter_' + colorId">
    <input
        :id="'color_filter_' + colorId"
        class="colors__radio sr-only"
        type="radio"
        :value="colorId"
        :checked="colorId === activeColor"
        @input="$emit('input', Number($event.target.value))"
    >
    <span class="colors__value" :style="{'background-color': allColors[colorId-1].color}"></span>
    </label>
  </li>
</template>

<script>
import allColors from '@/data/colors';

export default {
  name: 'ProductItemColor',
  props: ['colorId', 'activeColor'],
  data() {
    return {};
  },
  computed: {
    allColors() {
      return allColors;
    },
  },
};
</script>

<style scoped lang="sass">
</style>
