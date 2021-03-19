import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { get, initial, last } from 'lodash'

Vue.use(Vuelidate)

Vue.directive('vuelidate', {
  bind(el, binding, vnode) {
    const target = () => {
      const paths = initial(binding.expression.split('.'))
      return paths.length ? get(vnode.context, paths.join('.')) : vnode.context
    }
    const name = () => {
      return last(binding.expression.split('.'))
    }
    el.addEventListener('input', () => {
      Vue.set(target(), name(), el.value)
    })
    el.addEventListener('blur', () => {
      console.log('hoehgoe')
      const v = get(vnode.context.$v, binding.expression)
      v.$touch()
    })
    el.value = binding.value || ''
  },
  update(el, binding, vnode) {
    const v = get(vnode.context.$v, binding.expression)
    stateClasses.forEach(([property, truthy, falsy]) => {
      if (v['$' + property]) {
        el.classList.remove(falsy)
        el.classList.add(truthy)
      } else {
        el.classList.remove(truthy)
        if (falsy) el.classList.add(falsy)
      }
    })
  },
})

const stateClasses = [
  ['anyDirty', '-v-any-dirty', '-v-all-pristine'],
  ['anyError', '-v-any-error', '-v-all-correct'],
  ['error', '-v-error', '-v-correct'],
  ['dirty', '-v-dirty', '-v-pristine'],
  ['pending', '-v-pending', null],
  ['invalid', '-v-invalid', '-v-valid'],
]
