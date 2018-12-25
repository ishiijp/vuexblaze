import mutations from './mutations'
import VuexBlazeConfig from './classes/VuexBlazeConfig'

const plugin = store => {
  store.registerModule('vuexblaze', {
    getters: {
      'vuexblaze/$firestore': () => store.$firestore || store.$fireStore
    },
    mutations
  })
}

plugin.config = function(config) {
  VuexBlazeConfig.setAll(config)
  return this
}

export default plugin
