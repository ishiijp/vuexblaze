<template>
  <f-step :settings="currentStep" />
</template>

<script>
import { get, dispatch } from 'vuex-pathify'

export default {
  directives: {
    form: {},
  },
  computed: {
    currentStep: get('currentStep'),
  },
  created() {
    dispatch('init')
  },
  mounted() {},
}
</script>
