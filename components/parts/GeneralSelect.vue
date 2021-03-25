<template>
  <ul class="general-select">
    <li
      v-for="selectOption in settings.options.selectOptions"
      :key="selectOption.value"
      class="item"
    >
      <label class="label">
        <input
          v-model="form.selection"
          type="radio"
          :name="settings.partId"
          :value="selectOption.value"
        />
        {{ selectOption.label }}
      </label>
    </li>
  </ul>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  inject: ['getForm', 'getSettings'],
  data() {
    return {
      form: this.getForm(this, {
        selection: '',
      }),
      settings: this.getSettings(this),
    }
  },
  validations: {
    form: {
      selection: { required },
    },
  },
}
</script>
