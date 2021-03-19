<template>
  <form class="form-step">
    <div class="step-header">
      <h2 class="heading">{{ settings.title }}</h2>
      <div class="contacts">
        <div class="title">担当者に連絡</div>
        <div class="contact">
          <a href="" class="btn -tel">
            <img
              src="data:image/svg+xml;base64,PHN2ZyBpZD0iNGI5MTkxZGItMDliMS00MDFkLWIwOTMtOTA4ZDJjY2RjNWYwIiBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+PHBhdGggZD0iTTUwLDBhNTAsNTAsMCwxLDAsNTAsNTBBNTAsNTAsMCwwLDAsNTAsMFptMCw5NkE0Niw0NiwwLDEsMSw5Niw1MCw0Niw0NiwwLDAsMSw1MCw5NloiIHN0eWxlPSJmaWxsOiNmZmYiLz48cGF0aCBkPSJNNjMuNSw1OWMtMS43LS42LTQsLjktNC43LDIuOVM1Nyw2My42LDU3LDYzLjZzLTQtMS44LTExLTEwLjEtOC4xLTEyLjQtOC4xLTEyLjRTMzcuOCw0MCw0MCwzOS42czMuOS0yLjQsMy43LTQuMUE1My40LDUzLjQsMCwwLDAsMzguOSwyNGMtMS42LTIuNC01LjEtMS41LTYtMXMtOS4zLDQuOS03LjcsMTQuNkE1MC40LDUwLjQsMCwwLDAsMzYuNiw2MS41LDQ5LjksNDkuOSwwLDAsMCw1OC4yLDc2LjhjOS4zLDMuMiwxNS4xLTQuNCwxNS43LTUuMnMyLjEtNC4xLDAtNi4xQTU0LjMsNTQuMywwLDAsMCw2My41LDU5WiIgc3R5bGU9ImZpbGw6I2ZmZiIvPjwvc3ZnPg=="
              class="img"
            />
          </a>
          <a href="" class="btn -mail"
            ><img
              src="data:image/svg+xml;base64,PHN2ZyBpZD0iNzVmYTgwMmQtY2RkZC00NTNkLWJiMjMtOThjNTAzOWM1YmNmIiBkYXRhLW5hbWU9ImNvbnRyYWN0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+aWNvbjwvdGl0bGU+PHBhdGggZD0iTTUwLDBhNTAsNTAsMCwxLDAsNTAsNTBBNTAsNTAsMCwwLDAsNTAsMFptMCw5NkE0Niw0NiwwLDEsMSw5Niw1MCw0Niw0NiwwLDAsMSw1MCw5NloiIHN0eWxlPSJmaWxsOiNmZmYiLz48cGF0aCBkPSJNNjkuNSwyN2gtMzlBMTEuNiwxMS42LDAsMCwwLDE5LDM4LjV2MjNBMTEuNiwxMS42LDAsMCwwLDMwLjUsNzNoMzlBMTEuNiwxMS42LDAsMCwwLDgxLDYxLjV2LTIzQTExLjYsMTEuNiwwLDAsMCw2OS41LDI3Wm0tMzksNkg3MC42bC0xNy4xLDE5YTQuNiw0LjYsMCwwLDEtNywwbC0xNy4xLTE5Wk03NSw2MS41QTUuNSw1LjUsMCwwLDEsNjkuNSw2N2gtMzlBNS41LDUuNSwwLDAsMSwyNSw2MS41di0yM2E0LjksNC45LDAsMCwxLC4xLTEuMmwxNywxOC44YTEwLjUsMTAuNSwwLDAsMCwxNS44LDBsMTctMTguOGE0LjksNC45LDAsMCwxLC4xLDEuMloiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4="
              class="img"
          /></a>
        </div>
      </div>
    </div>
    <div class="main step-main">
      <div class="back">
        <a class="link" @click="back">戻る</a>
      </div>
      <progress-bar />
      <div class="message">
        駐車場をお申込みされる契約名義人の情報を入力してください
      </div>
      <component
        :is="`parts-${part.type}`"
        v-for="(part, i) in settings.parts"
        :key="`${settings.stepId}-${i}`"
        ref="parts"
        :data-part-index="i"
      />
      <input
        v-if="settings.postProcess"
        type="button"
        class="btn -next"
        value="次へ"
        @click="send"
      />
    </div>
  </form>
</template>

<script>
import { dispatch, get } from 'vuex-pathify'
import { cloneDeep } from 'lodash'
import ProgressBar from '@/components/Progress-bar'

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
  > .main {
    max-width: 1000px;
    margin: 40px auto;
  }
}

.step-header {
  display: flex;
  align-items: center;
  padding: 16px 10px;
  background: #333;
  color: #fff;
  > .heading {
    margin: 0;
    font-size: 18px;
  }
  > .contacts {
    margin-left: auto;
  }
  > .contacts > .title {
    width: 100%;
    margin: 0 auto 2px;
    text-align: center;
    font-size: 0.7em;
    font-weight: bold;
    color: #fff;
  }
  > .contacts > .contact {
    display: flex;
    align-items: center;
  }
  > .contacts > .contact > .btn {
    width: 34px;
    margin: 0 4px;
  }
}

.step-main {
  padding: 0 10px;
  > .back {
    margin: 16px 0;
    text-align: center;
  }
  > .back > .link {
    color: #0277bd;
    font-size: 0.8rem;
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
  > .btn.-next {
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
