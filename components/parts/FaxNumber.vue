<template>
  <fieldset class="landline-mobile-numbers">
    <legend class="label">
      FAX番号<span class="note">半角ハイフンなし</span>
    </legend>
    <input v-vuelidate="form.faxNumber" class="input" type="tel" />
  </fieldset>
</template>

<script>
import { maxLength } from 'vuelidate/lib/validators'

export default {
  inject: ['getForm'],
  data() {
    return {
      form: this.getForm(this, {
        faxNumber: '',
      }),
    }
  },
  validations: {
    form: {
      zip: { maxLength: maxLength(8) },
    },
  },
}
</script>

<style lang="scss" scoped>
.landline-mobile-numbers {
  margin: 16px 0;
  padding: 0;
  border: none;
  > .label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  > .label > .note {
    margin-left: 8px;
    padding: 0 5px;
    color: #00f;
    border: 1px solid #00f;
    font-size: 0.75rem;
    font-weight: normal;
  }
  > .input {
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
