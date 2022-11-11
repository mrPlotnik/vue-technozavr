<template>
  <li class="colors__item">
    <label class="colors__label" :for="'color_' + colors.color">
      <input
        :id="'color_' + colors.color"
        class="colors__radio sr-only"
        type="radio"
        :value="colors.color"
        :checked="colors.active"
        @input="$emit('input', $event.target.value)"
      >
      <span class="colors__value" :style="{'background-color': colors.color}"></span>
    </label>
  </li>
</template>

<script>
export default {
  name: 'ProductItemColor',
  props: ['colors', 'value'],
  data() {
    return {};
  },
  computed: {},
};
</script>
<style scoped lang="sass">
.colors__value
  border: 1px solid #000
</style>
