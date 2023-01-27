<template>
  <ul class="catalog__pagination pagination" v-show="count !== 0">

    <!-- Предыдущая страница -->
    <li class="pagination__item">
      <a
        href="#"
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': page === 1}"
        aria-label="Предыдущая страница"
        @click.prevent="decrement(page)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>

    <!-- Промежуточные значения -->
    <li
      class="pagination__item"
      v-for="pageNumber in pages"
      :key="pageNumber"
    >
      <a
        href="#"
        class="pagination__link"
        :class="{'pagination__link--current': pageNumber === page}"
        @click.prevent="paginate(pageNumber)"
      >
        {{ pageNumber }}
      </a>
    </li>

    <!-- Следующая страница -->
    <li class="pagination__item">
      <a
        href="#"
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': page === 3}"
        aria-label="Следующая страница"
        @click.prevent="increment(page)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>

  </ul>
</template>

<script>
export default {
  props: ['page', 'count', 'perPage'],
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      this.$emit('update:page', page);
    },
    increment(page) {
      if (page < this.perPage) {
        this.$emit('update:page', page + 1);
      }
    },
    decrement(page) {
      if (page > 1) {
        this.$emit('update:page', page - 1);
      }
    },
  },
};
</script>
