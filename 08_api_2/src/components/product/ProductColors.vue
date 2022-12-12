<template>
  <li class="colors__item">
    <label class="colors__label" :for="'item-' + parentIndex + '-color-' + color.id">
      <input
        :id="'item-' + parentIndex + '-color-' + color.id"
        class="colors__radio sr-only"
        type="radio"
        :value="color.code"
        :checked="check"
        @input="$emit('input', $event.target.value)"
      >
      <span class="colors__value" :style="{'background-color': color.code}"></span>
    </label>
  </li>
</template>

<script>

export default {
  name: 'ProductItemColor',
  props: ['color', 'parentIndex', 'activeColorCode'],
  data() {
    return {};
  },
  computed: {
    check() {
      return this.activeColorCode === this.color.code;
    },
  },
};

</script>
<style scoped lang="sass">
.colors__value
  border: 1px solid #000
</style>
