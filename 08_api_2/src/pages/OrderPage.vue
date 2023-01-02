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
        3 товара
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <div class="cart__data">

            <BaseFormText
              id="fullname"
              title="ФИО"
              type="text"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
              v-model="formData.name"
            />

            <BaseFormText
              id="address"
              title="Адрес"
              type="text"
              :error="formError.address"
              placeholder="Введите ваш адрес"
              v-model="formData.address"
            />

            <BaseFormText
              id="tel"
              title="Телефон"
              type="tel"
              :error="formError.phone"
              placeholder="Введите ваш телефон"
              v-model="formData.phone"
            />

            <BaseFormText
              id="email"
              title="Email"
              type="email"
              :error="formError.email"
              placeholder="Введи ваш Email"
              v-model="formData.email"
            />

            <BaseFormTextarea
              id="comments"
              title="Комментарий к заказу"
              type="text"
              :error="formError.comments"
              placeholder="Ваши пожелания"
              v-model="formData.comments"
            />

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label" for="qwe">
                  <input
                    id="qwe"
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="0"
                    checked="">
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label" for="qwe">
                  <input
                    id="qwe"
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="500">
                  <span class="options__value">
                    Курьером <b>500 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label" for="qwe">
                  <input
                    id="qwe"
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="card">
                  <span class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label" for="qwe">
                  <input
                    id="qwe"
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="cash">
                  <span class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order">
              <h3>Смартфон Xiaomi Redmi Note 7 Pro 6/128GB</h3>
              <b>18 990 ₽</b>
              <span>Артикул: 150030</span>
            </li>
            <li class="cart__order">
              <h3>Гироскутер Razor Hovertrax 2.0ii</h3>
              <b>4 990 ₽</b>
              <span>Артикул: 150030</span>
            </li>
            <li class="cart__order">
              <h3>Электрический дрифт-карт Razor Lil’ Crazy</h3>
              <b>8 990 ₽</b>
              <span>Артикул: 150030</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: <b>3</b> товара на сумму <b>37 970 ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';

export default {
  name: 'OrderPage',
  components: { BaseFormText, BaseFormTextarea },
  data() {
    return {
      formData: {},
      formError: {},
    };
  },
};
</script>

<style lang="sass">

.cart__data
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin-bottom: 30px

.form__input-wrap
  position: relative
  width: calc(50% - 5px)

.form__input-wrap:not(:last-child)
  margin-bottom: 20px

.form__input-wrap--area
  width: 100%

.form__label
  display: block
  background-color: #fff
  color: #737373

.form__input
  padding: 28px 45px 13px 20px
  width: 100%
  height: 65px
  border-radius: 0
  background-color: transparent
  border: 1px solid #cfcfcf
  -webkit-box-shadow: none
  box-shadow: none
  -webkit-transition: all .2s ease
  transition: all .2s ease
  color: #222
  font-size: 16px
  font-family: inherit
  line-height: 1

.form__value
  position: absolute
  top: 10px
  left: 20px
  font-size: 12px
  line-height: 1
  font-weight: 300

</style>
