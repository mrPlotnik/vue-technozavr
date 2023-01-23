<template>
  <main class="content container">

    <div class="content__top">

      <!-- Хлебные крошки -->
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html">
            Корзина
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <!-- Заголовок страницы -->
      <h1 class="content__title">
        Корзина
      </h1>

      <!-- Всего продуктов в корзине -->
      <span class="content__info">
        {{ totalProducts }} товара
      </span>

    </div>

    <section class="cart">

      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">

        <PreLoader v-if="preloader"/>

        <div class="cart__field" v-else>
          <div class="cart__data">
            <BaseFormText
              v-for="input in inputsText"
              :key="input.id"
              :id="input.id"
              classParent="form__input-wrap"
              classLabel="form__label"
              classInput="form__input"
              :name="input.name"
              :type="input.type"
              :title="input.title"
              :error="input.error"
              :placeholder="input.placeholder"
              v-model="input.value"
            />
            <BaseFormTextarea
              v-for="input in inputsTextarea"
              :key="input.id"
              :id="input.id"
              classParent="form__input-wrap--area"
              classLabel="form__label"
              classInput="form__input form__input--area"
              :name="input.name"
              :type="input.type"
              :title="input.title"
              :error="input.error"
              :placeholder="input.placeholder"
              v-model="input.value"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <OrderInputRadio
                v-for="input in deliveryInputsRadio"
                :key="input.id"
                :id="input.id"
                classParent="options__item"
                classLabel="options__label"
                classInput="options__radio sr-only"
                classSpan="options__value"
                :title="input.title"
                :active="activeDelivery"
                :value="input.value"
                :name="input.name"
                @change="activeDelivery = $event"
              >
                <b>{{ input.amount }}</b>
              </OrderInputRadio>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <OrderInputRadio
                v-for="input in paymentInputsRadio"
                :key="input.id"
                :id="input.id"
                classParent="options__item"
                classLabel="options__label"
                classInput="options__radio sr-only"
                classSpan="options__value"
                :title="input.title"
                :active="activePayment"
                :value="input.value"
                :name="input.name"
                @change="activePayment = $event"
              />
            </ul>
          </div>

        </div>

        <!-- Список товаров -->
        <OrderList
          :products="products"
          :totelPrice="totelPrice"
          :totalProducts="totalProducts"
          :delivery="delivery"
          :error="formErrorMessage"
        >
          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </OrderList>

      </form>
    </section>

  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import PreLoader from '@/components/PreLoader.vue';
import axios from 'axios';
import API_BASE_URL from '@/config';
import OrderList from '@/components/order/OrderList.vue';
import OrderInputRadio from '@/components/order/OrderInputRadio.vue';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';

export default {
  name: 'OrderPage',
  components: {
    OrderList, BaseFormText, BaseFormTextarea, OrderInputRadio, PreLoader,
  },
  data() {
    return {
      preloader: false,
      activeDelivery: 'courier',
      activePayment: 'card',
      formError: {},
      formErrorMessage: '',
      inputsText: [
        {
          id: 'order-fullname', name: 'name', title: 'ФИО', type: 'text', placeholder: 'Введите ваше полное имя', value: '', error: '',
        },
        {
          id: 'order-address', name: 'address', title: 'Адрес', type: 'text', placeholder: 'Введите ваш адрес', value: '', error: '',
        },
        {
          id: 'order-tel', name: 'phone', title: 'Телефон', type: 'tel', placeholder: 'Введите ваш телефон', value: '', error: '',
        },
        {
          id: 'order-email', name: 'email', title: 'email', type: 'email', placeholder: 'Введи ваш Email', value: '', error: '',
        },
      ],
      inputsTextarea: [
        {
          id: 'order-comment', name: 'comment', title: 'Комментарий к заказу', placeholder: 'Ваши пожелания', value: '',
        },
      ],
      deliveryInputsRadio: [
        {
          id: 'delivery-pickup', title: 'Самовывоз', name: 'delivery', value: 'pickup', amount: 'бесплатно',
        },
        {
          id: 'delivery-courier', title: 'Курьером', name: 'delivery', value: 'courier', amount: '500 ₽',
        },
      ],
      paymentInputsRadio: [
        {
          id: 'payment-card', title: 'Картой при получении', name: 'payment', value: 'card',
        },
        {
          id: 'payment-cash', title: 'Наличными при получении', name: 'payment', value: 'cash',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      products: 'basketProductsDetail',
      totelPrice: 'basketTotalPrice',
      totalProducts: 'basketTotalProducts',
    }),
    formData() {
      return {
        name: this.inputsText.find((el) => el.name === 'name').value,
        address: this.inputsText.find((el) => el.name === 'address').value,
        phone: this.inputsText.find((el) => el.name === 'phone').value,
        email: this.inputsText.find((el) => el.name === 'email').value,
      };
    },
    delivery() {
      return this.activeDelivery === 'courier'
        ? this.deliveryInputsRadio.find((e) => e.value === 'courier').amount
        : this.deliveryInputsRadio.find((e) => e.value === 'pickup').amount;
    },
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.preloader = true;
      axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          this.preloader = false;
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', response.data);
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
        })
        .catch((error) => {
          this.preloader = false;
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        });
    },
    error() {
      this.inputsText.find((el) => el.name === 'name').error = this.formError.name;
      this.inputsText.find((el) => el.name === 'address').error = this.formError.address;
      this.inputsText.find((el) => el.name === 'phone').error = this.formError.phone;
      this.inputsText.find((el) => el.name === 'email').error = this.formError.email;
    },
  },
  watch: {
    formError() {
      this.error();
    },
  },
};
</script>
