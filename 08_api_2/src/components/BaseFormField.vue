<template>
  <div>
    <slot/>
    <span class="form__error" v-if="error">
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'BaseFormField',
  props: ['error'],
};
</script>
