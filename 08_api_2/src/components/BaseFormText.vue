<template>

  <BaseFormField
    :class="classParent"
    :title="title"
    :error="error"
  >
    <label :class="classLabel" :for="id">
      <input
        :id="id"
        :class="classInput"
        :type="type"
        :placeholder="placeholder"
        v-model="dataValue"
      >
      <span class="form__value">{{ title }}</span>
    </label>
  </BaseFormField>

</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin],
};
</script>
