<template>
  <f-fieldset>
    <template #legend>連絡先</template>
    <template #message>{{ settings.messages._main }}</template>
    <f-text
      v-model="form.landlineNumber"
      v-vuelidate="{
        errors: {
          required: '固定電話番号と携帯電話番号のどちらかは必須です',
        },
      }"
      class="_col-2"
      type="tel"
      label="固定電話番号"
      placeholder="0311111111"
      :message="settings.messages.landlineNumber"
      @paste="removeHiphen"
    />
    <f-text
      v-model="form.mobileNumber"
      v-vuelidate="{
        errors: {
          required: '固定電話番号と携帯電話番号のどちらかは必須です',
        },
      }"
      class="_col-2"
      type="tel"
      label="携帯電話番号"
      placeholder="09011111111"
      :message="settings.messages.mobileNumber"
      @paste="removeHiphen"
    />
    <f-text
      v-model="form.faxNumber"
      v-vuelidate
      class="_col-2"
      type="tel"
      label="FAX番号"
      placeholder="0311212122"
      :message="settings.messages.faxNumber"
      @paste="removeHiphen"
    >
    </f-text>
  </f-fieldset>
</template>

<script>
import { maxLength, requiredUnless, helpers } from 'vuelidate/lib/validators'

export default {
  inject: ['getForm', 'getSettings'],
  data() {
    return {
      form: this.getForm(this, {
        landlineNumber: '',
        mobileNumber: '',
        faxNumber: '',
      }),
      settings: this.getSettings(this),
    }
  },
  validations: {
    form: {
      landlineNumber: {
        maxLength: maxLength(11),
        tel: helpers.regex('tel', /^[0-9]+$/),
        required: requiredUnless((model) => Boolean(model.mobileNumber)),
      },
      mobileNumber: {
        maxLength: maxLength(11),
        tel: helpers.regex('tel', /^[0-9]+$/),
        required: requiredUnless((model) => Boolean(model.landlineNumber)),
      },
      faxNumber: {
        tel: helpers.regex('tel', /^[0-9]+$/),
        maxLength: maxLength(11),
      },
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
