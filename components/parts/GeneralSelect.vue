<template>
  <ul v-vuelidate="{ model: 'form.selection' }" class="general-select">
    <div class="note">どちらか選択してください</div>
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
          class="radio"
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

<style lang="scss" scoped>
.general-select {
  position: relative;
  padding: 0;
  > .item {
    margin: 4px 0;
  }
  > .item > .label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  > .item > .label > .radio {
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    appearance: none;
    border-color: #666;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    &:checked::after {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #666;
    }
  }

  > .note {
    display: none;
    position: absolute;
    top: -28px;
    left: -2px;
    padding: 2px 4px;
    border-radius: 3px;
    background: red;
    color: #fff;
    font-size: 0.75rem;
    &::after {
      position: absolute;
      left: 2px;
      bottom: -6px;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 8px 0 8px;
      border-color: red transparent transparent transparent;
    }
  }
  &.-v-error {
    > .note {
      display: block;
    }
    > .item > .label > .radio {
      border-color: red;
    }
  }
}
</style>
