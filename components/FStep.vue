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
    width: 100%;
    margin-top: 24px;
    padding: 16px;
    background: #00acbf;
    border-radius: 3px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 26%);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    outline: none;
  }
}
</style>
