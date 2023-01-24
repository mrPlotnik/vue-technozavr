<template>
  <li :class="classParent">
    <label :class="classLabel" :for="id">
      <input
        :id="id"
        :class="classInput"
        type="radio"
        :name="name"
        :value="id"
        :checked="id === active"
        @input="$emit('change', $event.target.value)"
      >
      <span :class="classSpan">{{ title }}&nbsp;<slot/></span>
    </label>
  </li>
</template>

<script>
export default {
  props: [
    'id',
    'classParent',
    'classLabel',
    'classSpan',
    'classInput',
    'title',
    'name',
    'value',
    'active',
  ],
};
</script>
