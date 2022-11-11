<template>
  <li class="colors__item">
    <label class="colors__label" :for="'color_' + parentIndex + childIndex">
      <input
        :id="'color_' + parentIndex + childIndex"
        class="colors__radio sr-only"
        type="radio"
        :value="colorId"
        :checked="check"
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
  props: ['colorId', 'activeColor', 'parentIndex', 'childIndex'],
  data() {
    return {};
  },
  computed: {
    allColors() {
      return allColors;
    },
    check() {
      if (this.activeColor === 0) {
        return this.childIndex === 0;
      }
      return this.colorId === this.activeColor;
    },
  },
};
</script>
<style scoped lang="sass">
.colors__value
  border: 1px solid #000
</style>
