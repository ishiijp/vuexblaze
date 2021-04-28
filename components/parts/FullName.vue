<template>
  <f-fieldset class="full-name">
    <template #legend>お名前</template>
    <f-text
      v-model="form.lastName"
      v-vuelidate
      class="_col-2"
      type="text"
      label="姓"
      placeholder="山田"
    />
    <f-text
      v-model="form.firstName"
      v-vuelidate
      class="_col-2"
      type="text"
      label="名"
      placeholder="太郎"
    />
    <f-text
      v-model="form.lastNameKana"
      v-vuelidate
      class="_col-2"
      type="text"
      label="姓(フリガナ)"
      placeholder="ヤマダ"
    />
    <f-text
      v-model="form.firstNameKana"
      v-vuelidate
      class="_col-2"
      type="text"
      label="名(フリガナ)"
      placeholder="タロウ"
    />
  </f-fieldset>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { kana } from '~/libs/validators'

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
      lastNameKana: { required, kana, maxLength: maxLength(100) },
      firstNameKana: { required, kana, maxLength: maxLength(100) },
    },
  },
}
</script>
