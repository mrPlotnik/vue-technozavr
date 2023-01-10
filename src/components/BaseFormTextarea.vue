<template>

  <BaseFormField
    :class="classParent"
  >
    <label :class="classLabel" :for="id">
      <textarea
        :id="id"
        :class="classInput"
        :name="name"
        type="text"
        :placeholder="placeholder"
        v-model="dataValue"
      ></textarea>
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
