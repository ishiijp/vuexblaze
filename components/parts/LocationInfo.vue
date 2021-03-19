<template>
  <fieldset class="location-info">
    <div class="title">所在地</div>
    <p class="message">最後まで正しく入力してください</p>

    <div class="location -zip">
      <div class="label">
        郵便番号<span class="required">必須</span
        ><span class="note">半角ハイフンなし</span>
      </div>
      <input v-vuelidate="form.zip" type="text" class="input" />
    </div>

    <div class="location -address">
      <div class="label">ご住所<span class="required">必須</span></div>
      <input v-vuelidate="form.address" type="text" class="input" />
    </div>

    <div class="location -kana">
      <div class="label">
        ご住所(フリガナ)<span class="required">必須</span>
      </div>
      <input v-vuelidate="form.addressKana" type="text" class="input" />
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
        zip: '',
        address: '',
        addressKana: '',
      }),
    }
  },
  validations: {
    form: {
      zip: { required, maxLength: maxLength(8) },
      address: { required, maxLength: maxLength(100) },
      addressKana: { required, maxLength: maxLength(100) },
    },
  },
}
</script>

<style lang="scss" scoped>
.location-info {
  margin: 16px 0;
  padding: 0;
  border: none;
  > .title {
    margin-bottom: 5px;
    font-weight: bold;
  }
  > .message {
    color: red;
    font-size: 0.8125rem;
  }
  > .location:not(:last-child) {
    margin-bottom: 16px;
  }
  > .location > .label {
    margin-bottom: 5px;
    padding-left: 8px;
    border-left: 4px solid #454c50;
    font-weight: bold;
    font-size: 0.8125rem;
  }
  > .location > .label > .required {
    margin-left: 8px;
    padding: 0 5px;
    color: red;
    border: 1px solid red;
    font-size: 0.75rem;
    font-weight: normal;
  }
  > .location > .label > .note {
    margin-left: 8px;
    padding: 0 5px;
    color: #00f;
    border: 1px solid #00f;
    font-size: 0.75rem;
    font-weight: normal;
  }
  > .location > .input {
    width: 100%;
    height: 52px;
    padding: 0 16px;
    background: #f6f6f6;
    border: 1px solid #ccc;
    border-radius: 26px;
    outline: none;
    background-position: 98% 50%;
    background-size: 24px;
    &.-v-correct {
      background-image: url(data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8dGl0bGU+aWNvbjwvdGl0bGU+CiAgPHBhdGggc3R5bGU9ImZpbGw6IzQxYjg4MyIgZD0iTTgzLjIsMTcuMiw0NS41LDU0LjlhNCw0LDAsMCwxLTUuNywwbC0yMy0yM2E0LDQsMCwwLDAtNS43LDBMMi44LDQwLjJhNCw0LDAsMCwwLDAsNS42bDM3LDM3YTQsNCwwLDAsMCw1LjcsMEw5Ny4yLDMxLjFhNCw0LDAsMCwwLDAtNS42bC04LjMtOC4zQTQsNCwwLDAsMCw4My4yLDE3LjJaIi8+Cjwvc3ZnPgo=);
      background-repeat: no-repeat;
    }
    &.-v-error {
      background-image: url(data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+CjxwYXRoIHN0eWxlPSJmaWxsOnJlZCIgZD0iTTk3LjEsNzMuNiw2Mi41LDEzLjdjLTYuOS0xMS45LTE4LjEtMTEuOS0yNSwwTDIuOSw3My42Qy0zLjksODUuNSwxLjcsOTUuMiwxNS40LDk1LjJIODQuNkM5OC4zLDk1LjIsMTAzLjksODUuNSw5Ny4xLDczLjZabS00MC41LDRhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjcxLjhhMy44LDMuOCwwLDAsMSwzLjgtMy43aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjdabTAtMjBhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjMyLjRhMy44LDMuOCwwLDAsMSwzLjgtMy44aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjhaIi8+PC9zdmc+Cg==);
      background-repeat: no-repeat;
    }
  }
}
</style>
