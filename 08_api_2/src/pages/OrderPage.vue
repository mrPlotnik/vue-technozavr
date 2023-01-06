<template>
  <main class="content container">

    <div class="content__top">
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

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
       {{ totalProducts }}
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
              />
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

        <OrderList
          :products="products"
          :totelPrice="totelPrice"
          :totalProducts="totalProducts"
          :error="formErrorMessage"
        />

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
      activeDelivery: null,
      activePayment: null,
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
          id: 'delivery-pickup', title: 'Самовывоз <b>бесплатно</b>', name: 'delivery', value: 'pickup',
        },
        {
          id: 'delivery-courier', title: 'Курьером <b>500 ₽</b>', name: 'delivery', value: 'courier',
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
      products: 'cartDetailProducts',
      totelPrice: 'cartTotalPrice',
      totalProducts: 'cartTotalProducts',
    }),
    formData() {
      return {
        name: this.inputsText.find((el) => el.name === 'name').value,
        address: this.inputsText.find((el) => el.name === 'address').value,
        phone: this.inputsText.find((el) => el.name === 'phone').value,
        email: this.inputsText.find((el) => el.name === 'email').value,
      };
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
        .then(() => {
          this.preloader = false;
          this.$store.commit('resetCart');
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
