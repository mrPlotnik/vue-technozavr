import BaseFormField from '@/components/BaseFormField.vue';

export default {
  components: { BaseFormField },
  props: [
    'id',
    'classParent',
    'classLabel',
    'classInput',
    'title',
    'type',
    'error',
    'placeholder',
    'value',
  ],
  data() {
    return {};
  },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        return this.$emit('input', value);
      },
    },
  },
};
