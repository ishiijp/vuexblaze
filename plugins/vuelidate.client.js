import Vue from 'vue'
import Vuelidate from 'vuelidate'
import parseJSON from 'loose-json'

Vue.use(Vuelidate)

Vue.directive('vuelidate', {
  bind(el, binding, vnode) {
    if (!vnode.context.$validationTargets) vnode.context.$validationTargets = []
    if (!binding.value?.v) return
    vnode.context.$validationTargets.push({
      vnode,
      v: binding.value.v,
      label: binding.value.label,
    })

    el.addEventListener('focusout', (event) => {
      if (event.target.value) {
        binding.value.v.$touch()
      }
      updateClassesAll(vnode)
    })
    updateClassesAll(vnode)
  },
  update(_el, _binding, vnode) {
    updateClassesAll(vnode)
  },
})

const updateClassesAll = (vnode) => {
  vnode.context.$validationTargets.forEach((target) => {
    updateClasses(target)
  })
}

const updateClasses = ({ vnode, v }) => {
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
    if (v.$dirty && v.$model) {
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

export const vuelidateDirective = function (el, dir, warn) {
  const dirValue = dir.value ? parseJSON(dir.value) : {}

  if (dirValue.model?.startsWith('$v.')) {
    return true
  }

  const model =
    dirValue.model || el.directives.find((x) => x.name === 'model')?.value

  if (!model) {
    warn(`v-model or model value is required`)
    return false
  }

  const traverse = (el, expr) => {
    if (!el) return expr

    const newExpr = el.for
      ? `${el.for}.$each[${el.iterator1}]${expr.substr(el.alias.length)}`
      : expr
    return traverse(el.parent, newExpr)
  }

  const entry = `v: $v.${traverse(el, model)}`

  dir.value = dir.value
    ? dir.value.replace(/^{/, `{ ${entry},`)
    : `{ ${entry} }`

  return true
}

export const v = function () {
  return this.$vnode.data.directives?.find((dir) => {
    return dir.name === 'vuelidate'
  })?.value?.v
}

export const validationErrors = function () {
  const { v, errors } = this.$vnode.data.directives?.find((dir) => {
    return dir.name === 'vuelidate'
  })?.value || {}

  if (!v) return []
  return Object.entries(v.$params).reduce((messages, [name, options]) => {

    if (v[options.type]) return messages
    const template = errors?.[name] || ERRORS[options.type] || '入力した値にエラーがあります'
    const params = template.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g)
    const names = params
      ? [...new Set(params.map((x) => x.replace(/[{}]/g, '')))]
      : []

    /* eslint prettier/prettier: 0  */
    /* eslint no-new-func : 0 */
    const interpolate = Function(`"use strict";return(function(${names.join(',')}){return \`${template}\`})`)() // TODO Should I use tiny template engine library?
    const error = interpolate(names.map((x) => options[x]))
    messages.push(error)
    return messages
  }, [])
}

/* eslint no-template-curly-in-string: 0 */
const ERRORS = {
  // built-in validators
  required: '入力が必須です',
  minLength: '最小の長さは${min}文字です',
  maxLength: '最大の長さは${max}文字です',
  minValue: '最小の長さは${min}文字です',
  maxValue: '最大の長さは${max}文字です',
  between: '${min}から${max}までの値を入力してください',
  alpha: '半角英字のみを入力してください',
  alphaNum: '半角英数字のみを入力してください',
  numeric: '正しい数値を入力してください',
  integer: '正しい数値を入力してください',
  decimal: '正しい数値を入力してください',
  email: 'メールアドレスを入力してください',
  ipAddress: 'IPアドレスを入力してください',
  macAddress: 'MACアドレスを入力してください',
  sameAs: '${eq}と値が違います',
  url: 'URLを入力してください',
  // custom validators
  hiragana: 'ひらがなで入力してください',
  kana: 'カタカナで入力してください',
  number: '正しい数値を入力してください'
}
