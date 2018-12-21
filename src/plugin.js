import mutations from './mutations'
import VuexBlazeConfig from './classes/VuexBlazeConfig'

const vuexModule = {
  mutations
}

const plugin = store => {
  store.registerModule('vuexblaze', vuexModule)
}

plugin['config'] = function(config) {
  VuexBlazeConfig.setAll(config)
  return this
}

export default plugin