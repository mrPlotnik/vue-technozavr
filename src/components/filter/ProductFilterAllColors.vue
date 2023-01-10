<template>
  <li class="colors__item">
    <label class="colors__label" :for="'color_filter_' + color.id">
    <input
        :id="'color_filter_' + color.id"
        class="colors__radio sr-only"
        type="radio"
        :value="color.id"
        :checked="color.id === activeColor"
        @input="$emit('input', Number($event.target.value))"
    >
    <span class="colors__value" :style="{'background-color': color.code}"></span>
    </label>
  </li>
</template>

<script>

export default {
  name: 'ProductItemColor',
  props: ['color', 'activeColor'],
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style scoped lang="sass">
</style>
