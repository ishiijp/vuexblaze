<template>
  <fieldset class="landline-mobile-numbers">
    <div class="title">電話番号</div>
    <p class="message">※ 携帯電話と固定電話のどちらかは入力必須です</p>
    <div class="number">
      <div class="label">
        携帯電話<span class="note">半角ハイフンなし</span
        ><span class="required">※</span>
      </div>
      <input v-model="form.mobileNumber" type="tel" class="input" />
    </div>

    <div class="number">
      <div class="label">
        固定電話<span class="note">半角ハイフンなし</span
        ><span class="required">※</span>
      </div>
      <input v-model="form.landlineNumber" type="tel" class="input" />
    </div>
  </fieldset>
</template>

<script>
export default {
  inject: ['getForm'],
  data() {
    return {
      form: this.getForm(this, {
        landlineNumber: '',
        mobileNumber: '',
      }),
    }
  },
}
</script>

<style lang="scss" scoped>
.landline-mobile-numbers {
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
  > .number:not(:last-child) {
    margin-bottom: 16px;
  }
  > .number > .label {
    margin-bottom: 5px;
    padding-left: 8px;
    border-left: 4px solid #454c50;
    font-weight: bold;
    font-size: 0.8125rem;
  }
  > .number > .label > .required {
    margin-left: 8px;
    color: red;
    font-size: 0.75rem;
    font-weight: normal;
  }
  > .number > .label > .note {
    margin-left: 8px;
    padding: 0 5px;
    color: #00f;
    border: 1px solid #00f;
    font-size: 0.75rem;
    font-weight: normal;
  }
  > .number > .input {
    width: 100%;
    height: 52px;
    padding: 0 16px;
    background: #f6f6f6;
    border: 1px solid #ccc;
    border-radius: 26px;
    outline: none;
  }
}
</style>
