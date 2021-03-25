<template>
  <fieldset class="job-info">
    <div class="title">勤務先</div>

    <div class="company -name">
      <div class="label">
        ご契約者さまの勤務先<span class="required">必須</span>
      </div>
      <input v-vuelidate="form.companyName" type="text" class="input" />
    </div>

    <div class="company -address">
      <div class="label">
        ご契約者さまの勤務先フリガナ<span class="required">必須</span>
      </div>
      <input v-vuelidate="form.companyAddress" type="text" class="input" />
    </div>

    <div class="company -department">
      <div class="label">
        ご契約者さまの勤務先での部署<span class="required">必須</span>
      </div>
      <input
        v-vuelidate="form.companyDepartmentName"
        type="text"
        class="input"
      />
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
        companyName: '',
        companyAddress: '',
        companyDepartmentName: '',
      }),
    }
  },
  validations: {
    form: {
      companyName: { required, maxLength: maxLength(60) },
      companyAddress: { required, maxLength: maxLength(100) },
      companyDepartmentName: { required, maxLength: maxLength(80) },
    },
  },
}
</script>
