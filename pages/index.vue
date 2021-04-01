<template>
  <f-step />
</template>

<script>
import { dispatch } from 'vuex-pathify'

export default {
  directives: {
    form: {},
  },
  created() {
    dispatch('init')
  },
  mounted() {},
}
</script>
