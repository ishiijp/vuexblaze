<template>
  <f-fieldset class="full-name">
    <template #legend>お名前</template>
    <f-field
      v-form="form.lastName"
      class="_col-2"
      type="text"
      label="姓"
      placeholder="山田"
    />
    <f-field
      v-form="form.firstName"
      class="_col-2"
      type="text"
      label="名"
      placeholder="太郎"
    />
    <f-field
      v-form="form.lastNameKana"
      class="_col-2"
      type="text"
      label="姓(フリガナ)"
      placeholder="ヤマダ"
    />
    <f-field
      v-form="form.firstNameKana"
      class="_col-2"
      type="text"
      label="名(フリガナ)"
      placeholder="タロウ"
    />
  </f-fieldset>
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
