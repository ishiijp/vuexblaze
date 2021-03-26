<template>
  <f-fieldset>
    <template #legend>所在地</template>
    <template #message>最後まで正しく入力してください</template>
    <f-field
      v-form="form.zip"
      type="text"
      label="郵便番号"
      placeholder="1650051"
    />
    <f-field
      v-form="form.addressKana"
      type="text"
      label="ご住所"
      placeholder="東京都渋谷区代々木2-1-1 新宿マインズタワー19F"
    />
    <f-field
      v-form="form.addressKana"
      type="text"
      label="ご住所(フリガナ)"
      placeholder="トウキョウトシブヤクヨヨギ2-1-1 シンジュクマインズタワー19F"
    >
    </f-field>
  </f-fieldset>
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
