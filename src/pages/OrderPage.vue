<template>
  <main class="content container">

    <div class="content__top">

      <!-- Хлебные крошки -->
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
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

      <PreLoader v-show="preloader"/>

      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">

        <div class="cart__field">

          <!-- Инпуты -->
          <div class="cart__data">

            <!-- ФИО, адрес, email, телефон -->
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

            <!-- Комментарий -->
            <BaseFormTextarea
              v-for="input in inputsTextarea"
              :key="input.id"
              :id="input.id"
              classParent="form__input-wrap--area"
              classLabel="form__label"
              classInput="form__input form__input--area"
              name="comment"
              :type="input.type"
              :title="input.title"
              :error="input.error"
              :placeholder="input.placeholder"
              v-model="input.value"
            />
          </div>

          <!-- Доставка и оплата -->
          <div class="cart__options">

            <!-- Доставка -->
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
                name="Доставка"
                @change="activeDelivery = Number($event)"
              >
                <b>{{ input.price }}</b>
              </OrderInputRadio>
            </ul>

            <!-- Оплата -->
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
                name="Оплата"
                @change="activePayment = Number($event)"
              />
            </ul>

          </div>

        </div>

        <!-- Список товаров -->
        <OrderList
          :products="offers"
          :totalPrice="Number(totalPrice)"
          :totalProducts="totalProducts"
          :delivery="deliveryPrice"
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
      paymentsPreloader: false,
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
      deliveryInputsRadio: [],
      paymentInputsRadio: [],
    };
  },
  computed: {
    ...mapGetters({
      products: 'basketProductsDetail',
      totalPrice: 'basketTotalPrice',
      totalProducts: 'basketTotalProducts',
    }),
    formData() {
      return {
        name: this.inputsText.find((e) => e.name === 'name').value,
        address: this.inputsText.find((e) => e.name === 'address').value,
        phone: this.inputsText.find((e) => e.name === 'phone').value,
        email: this.inputsText.find((e) => e.name === 'email').value,
        deliveryTypeId: this.activeDelivery,
        paymentTypeId: this.activePayment,
        comment: this.inputsTextarea.find((e) => e.name === 'comment').value,
      };
    },
    deliveryPrice() {
      return this.deliveryInputsRadio.length !== 0
        ? this.deliveryInputsRadio.find((e) => e.id === this.activeDelivery).price
        : [];
    },
    offers() {
      const newArr = [];
      this.products.forEach((e) => {
        const obj = e.product;
        newArr.push(obj);
      });
      return newArr;
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
          // Очищаем корзину
          this.$store.commit('resetCart');
          // Обновляем заказ в state
          this.$store.commit('updateOrderInfo', response.data);
          // Переходим на страницу
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
    loadDeliveries() {
      this.preloader = true;
      axios
        .get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => {
          this.preloader = false;
          this.deliveryInputsRadio = response.data;
          // Первый элемент массива будет значением по умолчанию
          this.activeDelivery = response.data[0].id;
        })
        .catch(() => {
          // На случай ошибки
        });
    },
    loadPayments() {
      this.preloader = true;
      axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: this.activeDelivery,
          },
        })
        .then((response) => {
          this.preloader = false;
          this.paymentInputsRadio = response.data;
          // Первый элемент массива будет значением по умолчанию
          this.activePayment = response.data[0].id;
        })
        .catch(() => {
          // На случай ошибки
        });
    },
  },
  watch: {
    formError() {
      this.error();
    },
    activeDelivery() {
      this.loadPayments();
    },
  },
  created() {
    this.loadDeliveries();
  },
};
</script>
