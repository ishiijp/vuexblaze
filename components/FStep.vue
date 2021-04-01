<template>
  <form class="f-step">
    <h2 class="heading">{{ settings.title }}</h2>
    <div v-if="hasPreviousStep" class="back">
      <a class="link" @click="back">戻る</a>
    </div>
    <f-progress-bar />
    <div v-if="settings.message" class="message">
      {{ settings.message }}
    </div>
    <component
      :is="`parts-${part.type}`"
      v-for="(part, i) in settings.parts"
      :key="`${settings.stepId}-${i}`"
      ref="parts"
      :data-part-index="i"
      class="content"
    />
    <input
      v-if="settings.postProcess"
      type="button"
      class="btn"
      :class="{ '-v-error': hasError }"
      value="次へ"
      @click="send"
    />
  </form>
</template>

<script>
import { dispatch, get } from 'vuex-pathify'
import { cloneDeep } from 'lodash'

export default {
  provide() {
    return {
      getForm: (component, defultValue) => {
        const partIndex = component.$vnode.data.attrs['data-part-index']
        return this.currentStepResult
          ? cloneDeep(this.currentStepResult.parts[partIndex])
          : cloneDeep(defultValue)
      },
      getSettings: (component) => {
        const partIndex = component.$vnode.data.attrs['data-part-index']
        return this.settings.parts[partIndex]
      },
    }
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hasError: true,
    }
  },
  computed: {
    hasPreviousStep: get('hasPreviousStep'),
    currentStepResult: get('currentStepResult'),
    isValid() {
      return this.$refs.parts.reduce((bool, part) => {
        return bool && !part.$v?.$invalid
      }, true)
    },
  },
  methods: {
    send() {
      this.$refs.parts.forEach((part) => {
        part.$v?.$touch()
        part.$forceUpdate()
      })
      if (!this.isValid) {
        this.hasError = true
        return
      }
      dispatch('saveStepResult', {
        stepId: this.settings.stepId,
        parts: this.$refs.parts.map((x) => x.form),
      })
      dispatch('goNextStep')
    },
    back() {
      dispatch('goPreviousStep')
    },
  },
}
</script>

<style lang="scss" scoped>
.f-step {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 10px;
  > .back {
    margin: 16px 0;
    text-align: center;
  }
  > .back > .link {
    color: #0277bd;
    font-size: 0.8rem;
    cursor: pointer;
    &:hover {
      color: #37b2fb;
      text-decoration: none;
    }
  }
  > .message {
    margin: 32px 0;
    padding: 16px;
    border: 1px solid #00acbf;
    border-radius: 3px;
    color: #00acbf;
    line-height: 1.8;
  }
  > .content {
    margin: 16px 0;
  }
  > .btn {
    display: block;
    justify-content: center;
    width: 100%;
    max-width: 300px;
    margin: 24px auto 0;
    padding: 16px;
    border: none;
    background: #00acbf;
    border-radius: 28px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 26%);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    outline: none;
    &.-v-error {
      background: #dbdbdb
        url(data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+CjxwYXRoIHN0eWxlPSJmaWxsOnJlZCIgZD0iTTk3LjEsNzMuNiw2Mi41LDEzLjdjLTYuOS0xMS45LTE4LjEtMTEuOS0yNSwwTDIuOSw3My42Qy0zLjksODUuNSwxLjcsOTUuMiwxNS40LDk1LjJIODQuNkM5OC4zLDk1LjIsMTAzLjksODUuNSw5Ny4xLDczLjZabS00MC41LDRhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjcxLjhhMy44LDMuOCwwLDAsMSwzLjgtMy43aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjdabTAtMjBhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjMyLjRhMy44LDMuOCwwLDAsMSwzLjgtMy44aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjhaIi8+PC9zdmc+Cg==);
      background-repeat: no-repeat;
      background-size: 24px;
      background-position: right 16px center;
      box-shadow: none;
      pointer-events: none;
    }
  }
}
</style>
