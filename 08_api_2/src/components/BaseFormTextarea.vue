<template>

  <BaseFormField
    class="form__input-wrap--area"
    :title="title"
    :error="error"
  >
    <label class="form__label" :for="id">
      <textarea
        :id="id"
        class="form__input form__input--area"
        :placeholder="placeholder"
        v-model="dataValue"
      ></textarea>
    </label>
  </BaseFormField>

</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin],
};
</script>
