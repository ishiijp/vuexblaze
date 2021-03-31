<template>
  <f-fieldset>
    <template #legend>勤務先</template>
    <template #message>{{ settings.messages._main }}</template>
    <f-text
      v-model="form.company"
      v-vuelidate
      type="text"
      label="勤務先名"
      :message="settings.messages.company"
      placeholder="株式会社アズーム"
    />
    <f-text
      v-model="form.companyKana"
      v-vuelidate
      type="text"
      label="勤務先名(フリガナ)"
      :message="settings.messages.companyKana"
      placeholder="カブシキガイシャアズーム"
    />
    <f-text
      v-model="form.companyDepartment"
      v-vuelidate
      type="text"
      label="勤務先部署"
      :message="settings.messages.companyDepartment"
      placeholder="営業部"
    >
    </f-text>
  </f-fieldset>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  inject: ['getForm', 'getSettings'],
  data() {
    return {
      form: this.getForm(this, {
        company: '',
        companyKana: '',
        companyDepartment: '',
      }),
      settings: this.getSettings(this),
    }
  },
  validations: {
    form: {
      company: { required, maxLength: maxLength(60) },
      companyKana: { required, maxLength: maxLength(100) },
      companyDepartment: { required, maxLength: maxLength(80) },
    },
  },
}
</script>
