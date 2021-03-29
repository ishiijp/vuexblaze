<template>
  <div class="f-field">
    <div v-if="label" class="label">
      {{ label }}
    </div>
    <span v-if="hasRequired" class="required">必須</span>
    <div class="content">
      <input
        :value="value"
        type="text"
        class="input"
        :placeholder="placeholder"
      />
      <div class="note">半角ハイフンなし</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: null,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      hasRequired: true,
    }
  },
  mounted() {
    this.hasRequired = Boolean(this.$v?.$params.required)
  },
}
</script>

<style lang="scss" scoped>
.f-field {
  > .label {
    display: inline-block;
    margin-bottom: 5px;
    padding-left: 8px;
    border-left: 4px solid #454c50;
    font-weight: bold;
    font-size: 0.8125rem;
  }
  > .required {
    display: inline-block;
    margin-left: 8px;
    padding: 0 5px;
    color: red;
    border: 1px solid red;
    font-size: 0.75rem;
    font-weight: normal;
  }
  > .content {
    position: relative;
  }
  > .content > .note {
    display: none;
    position: absolute;
    top: -26px;
    right: 0;
    padding: 2px 4px;
    border-radius: 3px;
    background: red;
    color: #fff;
    font-size: 0.75rem;
    &::after {
      position: absolute;
      right: 16px;
      bottom: -6px;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 8px 0 8px;
      border-color: red transparent transparent transparent;
    }
  }
  > .content > .input {
    width: 100%;
    height: 52px;
    padding: 0 16px;
    background: #f6f6f6;
    border: 1px solid #ccc;
    border-radius: 26px;
    outline: none;
    background-position: right 12px center;
    background-size: 24px;
  }
  &.-v-correct > .content > .input {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8dGl0bGU+aWNvbjwvdGl0bGU+CiAgPHBhdGggc3R5bGU9ImZpbGw6IzQxYjg4MyIgZD0iTTgzLjIsMTcuMiw0NS41LDU0LjlhNCw0LDAsMCwxLTUuNywwbC0yMy0yM2E0LDQsMCwwLDAtNS43LDBMMi44LDQwLjJhNCw0LDAsMCwwLDAsNS42bDM3LDM3YTQsNCwwLDAsMCw1LjcsMEw5Ny4yLDMxLjFhNCw0LDAsMCwwLDAtNS42bC04LjMtOC4zQTQsNCwwLDAsMCw4My4yLDE3LjJaIi8+Cjwvc3ZnPgo=);
    background-repeat: no-repeat;
  }
  &.-v-error > .content > .input {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+CjxwYXRoIHN0eWxlPSJmaWxsOnJlZCIgZD0iTTk3LjEsNzMuNiw2Mi41LDEzLjdjLTYuOS0xMS45LTE4LjEtMTEuOS0yNSwwTDIuOSw3My42Qy0zLjksODUuNSwxLjcsOTUuMiwxNS40LDk1LjJIODQuNkM5OC4zLDk1LjIsMTAzLjksODUuNSw5Ny4xLDczLjZabS00MC41LDRhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjcxLjhhMy44LDMuOCwwLDAsMSwzLjgtMy43aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjdabTAtMjBhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjMyLjRhMy44LDMuOCwwLDAsMSwzLjgtMy44aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjhaIi8+PC9zdmc+Cg==);
    background-repeat: no-repeat;
    border: 1.4px solid red;
    &:focus + .note {
      display: block;
    }
  }
}
</style>
