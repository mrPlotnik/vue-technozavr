<template>

  <BaseFormField
    class="form__input-wrap"
    :title="title"
    :error="error"
  >
    <label class="form__label" :for="id">
      <input
        :id="id"
        class="form__input"
        :type="type"
        :placeholder="placeholder"
        v-model="dataValue"
      >
    </label>
  </BaseFormField>

</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin],
};
</script>
