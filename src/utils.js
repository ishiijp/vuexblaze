import { VUEXBLAZE_SNAKE_CASE, VUEXBLAZW_SCREAMING_SNAKE_CASE } from './options'

import { camelCase, upperFirst, snakeCase } from 'lodash'

export const actionNamer = caseName => {
  if (caseName === VUEXBLAZE_SNAKE_CASE) {
    return (action, target) => `${action}_${snakeCase(target)}`.toLowerCase()
  } else if (caseName === VUEXBLAZW_SCREAMING_SNAKE_CASE) {
    return (action, target) => `${action}_${snakeCase(target)}`.toUpperCase()
  }
  return (action, target) =>
    `${action.toLowerCase()}${upperFirst(camelCase(target))}`
}

export const isObject = o => o && typeof o === 'object'
export const isReference = o => o && o.onSnapshot
export const isDocumentReference = o => isReference(o) && !o.doc
export const isCollectionReference = o => isReference(o) && o.doc
