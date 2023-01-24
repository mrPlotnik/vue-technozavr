<template>
  <main class="content container">

    <!-- Хлеьные крошки -->
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
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина.
            На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>

            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.deliveryType.title }}&nbsp;
                ({{ orderInfo.deliveryType.price | numberFormat }}&nbsp;₽)
              </span>
            </li>

            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <OrderList
          :products="orderInfo.basket.items"
          :totalPrice="Number(orderInfo.totalPrice)"
          :totalProducts="totalProducts"
          :delivery="orderInfo.deliveryType.price"
        />

      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import OrderList from '@/components/order/OrderList.vue';

export default {
  name: 'OrderInfoPage',
  components: { OrderList },
  filters: { numberFormat },
  computed: {
    // Получаем информацию о корзине из state
    orderInfo() {
      return this.$store.getters.orderInfo ? this.$store.getters.orderInfo : {};
    },
    totalProducts() {
      return this.orderInfo.basket.items.reduce((acc, e) => e.quantity + acc, 0);
    },
  },
  created() {
    // Оптимизация, чтобы не делать ненужный (дублирующий) запрос
    // Если заказ не пустой и id заказа из state === id "в строке браузера"
    if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
      return;
    }
    // Загружаем данные заказа из с сервера
    // Этот экшн вызовет мутацию,
    // которая сделает запрос к серверу и запишет полученные данные в state
    this.$store.dispatch('loadOrderInfo', this.$route.params.id);
  },
};
</script>
