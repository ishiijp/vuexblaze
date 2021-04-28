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
      v-for="part in settings.parts"
      :key="`${part.partId}`"
      ref="parts"
      class="content"
    />

    <div class="next" :class="{ '-error': hasError }">
      <input
        v-if="settings.postProcess"
        type="button"
        class="btn"
        value="次へ"
        @click="send"
      />
      <div class="balloon">エラーを修正してください</div>
    </div>
  </form>
</template>

<script>
import { dispatch, get } from 'vuex-pathify'
import { cloneDeep } from 'lodash'

export default {
  provide() {
    return {
      getForm: (component, defaltValue) => {
        const partId = component.$vnode.data.key
        return this.result
          ? cloneDeep(this.result.parts.find((x) => x.partId === partId)?.form)
          : cloneDeep(defaltValue)
      },
      getSettings: (component) => {
        const partId = component.$vnode.data.key
        return this.settings.parts.find((x) => x.partId === partId)
      },
    }
  },
  data() {
    return {
      hasError: null,
    }
  },
  computed: {
    settings: get('currentStepSettings'),
    hasPreviousStep: get('hasPreviousStep'),
    result: get('currentStepResult'),
  },
  methods: {
    send() {
      this.$refs.parts.forEach((part) => {
        part.$v?.$touch()
        part.$forceUpdate()
      })

      this.checkErrors()
      if (this.hasError) return

      dispatch('saveStepResult', {
        stepId: this.settings.stepId,
        parts: this.$refs.parts.map((part) => ({
          partId: part.$vnode.data.key,
          form: part.form,
        })),
      })
      this.hasError = null
      dispatch('goNextStep')
    },
    checkErrors() {
      const checkHasError = () => {
        return this.$refs.parts.reduce((bool, part) => {
          return bool || part.$v?.$anyError
        }, false)
      }
      if (this.hasError === null) {
        this.$watch(
          () => checkHasError(),
          (val) => (this.hasError = val)
        )
        this.hasError = checkHasError()
      }
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
  > .next {
    position: relative;
    width: 300px;
    margin: 0 auto;
  }
  > .next > .btn {
    display: block;
    justify-content: center;
    width: 100%;
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
  }
  > .next > .balloon {
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
  > .next.-error > .btn {
    background: #dbdbdb
      url(data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+CjxwYXRoIHN0eWxlPSJmaWxsOnJlZCIgZD0iTTk3LjEsNzMuNiw2Mi41LDEzLjdjLTYuOS0xMS45LTE4LjEtMTEuOS0yNSwwTDIuOSw3My42Qy0zLjksODUuNSwxLjcsOTUuMiwxNS40LDk1LjJIODQuNkM5OC4zLDk1LjIsMTAzLjksODUuNSw5Ny4xLDczLjZabS00MC41LDRhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjcxLjhhMy44LDMuOCwwLDAsMSwzLjgtMy43aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjdabTAtMjBhMy44LDMuOCwwLDAsMS0zLjgsMy44SDQ3LjJhMy44LDMuOCwwLDAsMS0zLjgtMy44VjMyLjRhMy44LDMuOCwwLDAsMSwzLjgtMy44aDUuNmEzLjgsMy44LDAsMCwxLDMuOCwzLjhaIi8+PC9zdmc+Cg==);
    background-repeat: no-repeat;
    background-size: 24px;
    background-position: right 16px center;
    box-shadow: none;
    pointer-events: none;
  }

  > .next.-error > .balloon {
    display: block;
  }
}
</style>
