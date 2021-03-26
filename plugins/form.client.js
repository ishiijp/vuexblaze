import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { get, initial, last } from 'lodash'

Vue.use(Vuelidate)

Vue.directive('form', {
  bind(el, binding, vnode) {
    const v = get(vnode.context.$v, binding.expression)
    if (!v) return
    vnode.componentInstance.$v = v

    const target = () => {
      const paths = initial(binding.expression.split('.'))
      return paths.length ? get(vnode.context, paths.join('.')) : vnode.context
    }
    const name = () => {
      return last(binding.expression.split('.'))
    }
    el.addEventListener('input', (event) => {
      Vue.set(target(), name(), event.target.value)
    })

    el.addEventListener('focusout', () => {
      v.$touch()
      updateClasses(el, v)
    })
    el.value = binding.value || ''

    updateClasses(el, v)
  },
  update(el, binding, vnode) {
    if (binding.value === binding.oldValue) return
    const v = get(vnode.context.$v, binding.expression)
    updateClasses(el, v)
  },
})

const updateClasses = (el, v) => {
  if (!v) return
  stateClasses.forEach(([property, truthy, falsy, checkFalsyWith]) => {
    if (v['$' + property]) {
      el.classList.remove(falsy)
      el.classList.add(truthy)
    } else {
      el.classList.remove(truthy)
      if (falsy && checkFalsyWith && v['$' + checkFalsyWith]) {
        el.classList.add(falsy)
      }
    }
  })
}

const stateClasses = [
  ['anyDirty', '-v-any-dirty', '-v-all-pristine'],
  ['anyError', '-v-any-error', '-v-all-correct', 'anyDirty'],
  ['dirty', '-v-dirty', '-v-pristine'],
  ['error', '-v-error', '-v-correct', 'dirty'],
  ['pending', '-v-pending', null],
  ['invalid', '-v-invalid', '-v-valid'],
]
