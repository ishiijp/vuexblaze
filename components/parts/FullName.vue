<template>
  <fieldset class="full-name">
    <legend class="title">お名前</legend>
    <div class="area">
      <div class="name -last">
        <div class="label">姓<span class="required">必須</span></div>
        <input v-vuelidate="form.lastName" type="text" class="input" />
      </div>
      <div class="name -first">
        <div class="label">名<span class="required">必須</span></div>
        <input v-vuelidate="form.firstName" type="text" class="input" />
      </div>
    </div>
    <div class="area">
      <div class="name -last-kana">
        <div class="label">姓(フリガナ)<span class="required">必須</span></div>
        <input v-vuelidate="form.lastNameKana" type="text" class="input" />
      </div>
      <div class="name -first-kana">
        <div class="label">名(フリガナ)<span class="required">必須</span></div>
        <input v-vuelidate="form.firstNameKana" type="text" class="input" />
      </div>
    </div>
  </fieldset>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  inject: ['getForm'],
  data() {
    return {
      form: this.getForm(this, {
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
      }),
    }
  },
  validations: {
    form: {
      lastName: { required, maxLength: maxLength(100) },
      firstName: { required, maxLength: maxLength(100) },
      lastNameKana: { required, maxLength: maxLength(100) },
      firstNameKana: { required, maxLength: maxLength(100) },
    },
  },
}
</script>

<style lang="scss" scoped>
.full-name {
  margin: 16px 0;
  padding: 0;
  border: none;
  > .title {
    margin-bottom: 5px;
    font-weight: bold;
  }
  > .area {
    display: flex;
    &:not(:last-child) {
      margin: 16px 0;
    }
  }
  > .area > .name {
    width: 50%;
    &:first-child {
      margin-right: 24px;
    }
  }
  > .area > .name > .label {
    margin-bottom: 5px;
    padding-left: 8px;
    font-weight: bold;
    font-size: 0.8125rem;
    border-left: 4px solid #454c50;
  }
  > .area > .name > .label > .required {
    margin-left: 8px;
    padding: 0 5px;
    color: red;
    border: 1px solid red;
    font-size: 0.75rem;
    font-weight: normal;
  }
  > .area > .name > .input {
    width: 100%;
    height: 52px;
    padding: 0 16px;
    background: #f6f6f6;
    border: 1px solid #ccc;
    border-radius: 26px;
    outline: none;
  }
}
@media screen and (max-width: 767px) {
  .full-name {
    > .area > .name {
      &:first-child {
        margin-right: 12px;
      }
    }
  }
}
</style>
