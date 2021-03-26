<template>
  <f-fieldset>
    <template #legend>連絡先</template>
    <template #message>携帯電話と固定電話のどちらかは入力必須です</template>
    <f-field
      v-form="form.landlineNumber"
      class="_col-2"
      type="text"
      label="固定電話番号"
      placeholder="0311111111"
    />
    <f-field
      v-form="form.mobileNumber"
      class="_col-2"
      type="text"
      label="携帯電話番号"
      placeholder="09011111111"
    />
    <f-field
      v-form="form.faxNumber"
      class="_col-2"
      type="text"
      label="FAX番号"
      placeholder="0311212122"
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
        landlineNumber: '',
        mobileNumber: '',
        faxNumber: '',
      }),
    }
  },
  validations: {
    form: {
      landlineNumber: { required, maxLength: maxLength(11) },
      mobileNumber: { required, maxLength: maxLength(11) },
      faxNumber: { required, maxLength: maxLength(11) },
    },
  },
}
</script>
