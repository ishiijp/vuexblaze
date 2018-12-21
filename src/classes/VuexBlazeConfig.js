import { VUEXBLAZE_CAMEL_CASE } from '../options'

const vuexblazeConfig = {
  actionNameCase: VUEXBLAZE_CAMEL_CASE
}

export default class VuexBlazeConfig {

  static setAll(config) {
    if (config) {
      Object.entries(config).forEach(([key, value]) => {
        vuexblazeConfig[key] = value
      })
    }
  }

  static set(name, value) {
    vuexblazeConfig[name] = value
  }

  static get(name) {
    return vuexblazeConfig[name]
  }

  static exists(name) {
    return vuexblazeConfig[name] != undefined
  }
}