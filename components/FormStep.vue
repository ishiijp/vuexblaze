<template>
  <form class="form-step">
    <h2 class="heading">{{ settings.title }}</h2>
    <div class="back">
      <a class="link" @click="back">戻る</a>
    </div>
    <progress-bar />
    <div v-if="settings.desc" class="message">
      {{ settings.desc }}
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
      value="次へ"
      @click="send"
    />
  </form>
</template>

<script>
import { dispatch, get } from 'vuex-pathify'
import { cloneDeep } from 'lodash'
import ProgressBar from '@/components/ProgressBar'

export default {
  components: {
    ProgressBar,
  },
  provide() {
    return {
      getForm: (component, defultValue) => {
        const partIndex = component.$vnode.data.attrs['data-part-index']
        return this.currentStepResult
          ? cloneDeep(this.currentStepResult.parts[partIndex])
          : cloneDeep(defultValue)
      },
    }
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasPreviousStep: get('hasPreviousStep'),
    currentStepResult: get('currentStepResult'),
  },
  methods: {
    send() {
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
.form-step {
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
