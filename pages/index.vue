<template>
  <form-step :settings="currentStep" />
</template>

<script>
import { get, dispatch } from 'vuex-pathify'
import FormStep from '~/components/FormStep.vue'

export default {
  components: { FormStep },
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
