<template>
  <f-fieldset>
    <template #legend>所在地</template>
    <template #message>{{ settings.messages._main }}</template>
    <f-text
      v-model="form.zip"
      v-vuelidate
      type="text"
      label="郵便番号"
      :message="settings.messages.zip"
      placeholder="1650051"
      @paste="removeHiphen"
    />
    <f-text
      v-model="form.address"
      v-vuelidate
      type="text"
      label="ご住所"
      :message="settings.messages.address"
      placeholder="東京都渋谷区代々木2-1-1 新宿マインズタワー19F"
    />
    <f-text
      v-model="form.addressKana"
      v-vuelidate
      type="text"
      label="ご住所(フリガナ)"
      :message="settings.messages.addressKana"
      placeholder="トウキョウトシブヤクヨヨギ2-1-1 シンジュクマインズタワー19F"
    >
    </f-text>
  </f-fieldset>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { kana } from '~/libs/validators'

export default {
  inject: ['getForm', 'getSettings'],
  data() {
    return {
      form: this.getForm(this, {
        zip: '',
        address: '',
        addressKana: '',
      }),
      settings: this.getSettings(this),
    }
  },
  validations: {
    form: {
      zip: { required, maxLength: maxLength(7) },
      address: { required, maxLength: maxLength(100) },
      addressKana: { required, kana, maxLength: maxLength(100) },
    },
  },
  methods: {
    // TODO How to share this kind of method?
    removeHiphen(event) {
      event.preventDefault()
      const clipboard = event.clipboardData
      const text = clipboard.getData('Text')
      event.target.value = text.trim().replace(/-/g, '')
    },
  },
}
</script>
