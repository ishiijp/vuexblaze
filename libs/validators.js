import { helpers } from 'vuelidate/lib/validators'

/* eslint no-irregular-whitespace: 0 */
export const kana = helpers.withParams({ type: 'kana' }, (value) =>
  Boolean(value?.match(/^[ァ-ヶー　]*$/))
)

export const hiragana = helpers.withParams({ type: 'hiragana' }, (value) =>
  Boolean(value?.match(/^[\u3040-\u309F]+$/))
)

export const number = helpers.withParams({ type: 'number' }, (value) =>
  Boolean(value?.match(/^[0-9]*$/))
)
