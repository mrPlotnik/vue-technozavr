<template>
  <ul class="check-list">
    <li class="check-list__item" v-for="(elem, index) in memoryCounter" :key="index">
      <label class="check-list__label" :for="`check-list-${elem.gb}`">
        <input
          :id="`check-list-${elem.gb}`"
          class="check-list__check sr-only"
          type="checkbox"
          name="volume"
          :value="elem.gb"
          :checked="currentMemory.check"
          @input="$emit('check', elem.gb)"
        >
        <span class="check-list__desc">
          {{ elem.gb }}GB
          <span>({{ elem.count }})</span>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ProductFilterByMemory',
  props: ['memoryCounter', 'currentMemory'],
  data() {
    return {
      qwe: [],
    };
  },
  watch: {
    currentMemory(value) {
      this.qwe = value;
    },
  },
};
</script>
