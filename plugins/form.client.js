import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { get, initial, last } from 'lodash'

Vue.use(Vuelidate)

Vue.directive('form', {
  bind(el, binding, vnode) {
    const v = get(vnode.context.$v, binding.expression)
    if (!v) return
    vnode.componentInstance.$v = v
    if (!vnode.context.$v.vnodes) vnode.context.$v.vnodes = []
    vnode.context.$v.vnodes.push(vnode)

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

    el.addEventListener('focusout', (event) => {
      if (event.target.value) {
        v.$touch()
      }
      updateClassesAll(vnode)
    })

    vnode.componentInstance.defaultValue = binding.value || ''
    updateClassesAll(vnode)
  },
  update(_el, _binding, vnode) {
    if (vnode.componentInstance.$v.$error) {
      vnode.componentInstance.error = errorMessage()
    }
    updateClassesAll(vnode)
  },
})

const errorMessage = () => {
  return 'エラーがあります'
}

const updateClassesAll = (vnode) => {
  vnode.context.$v.vnodes.forEach(updateClasses)
}

const updateClasses = (vnode) => {
  const v = vnode.componentInstance.$v
  if (!v) return

  const addClass = (clazz) => {
    if (clazz) vnode.elm.classList.add(clazz)
  }
  const removeClass = (clazz) => {
    if (clazz) vnode.elm.classList.remove(clazz)
  }

  simpleToggleStateClasses.forEach(([property, truthy, falsy]) => {
    const bool = v['$' + property]
    addClass(bool ? truthy : falsy)
    removeClass(bool ? falsy : truthy)
  })

  if (v.$error) {
    addClass('-v-error')
    removeClass('-v-correct')
  } else {
    removeClass('-v-error')
    if (v.$dirty && vnode.componentInstance.value) {
      addClass('-v-correct')
    } else {
      removeClass('-v-correct')
    }
  }
}

const simpleToggleStateClasses = [
  ['anyDirty', '-v-any-dirty', '-v-all-pristine'],
  ['dirty', '-v-dirty', '-v-pristine'],
  ['invalid', '-v-invalid', '-v-valid'],
  ['pending', '-v-pending', ''],
  ['anyError', '-v-any-error', ''], // TODO should be like -v-error
]
