

import VuexBlazeDoc from './classes/VuexBlazeDoc'
import VuexBlazeCollection from './classes/VuexBlazeCollection'
import vuexblazePlugin from './plugin'
import vuexblazeTypes from './types'
import vuexblazeOptions from './options'

function doc(collectionName) {
  return new VuexBlazeDoc(collectionName)
}

function collection(collectionName) {
  return new VuexBlazeCollection(collectionName)
}

export {
  doc,
  collection,
  vuexblazeTypes,
  vuexblazeOptions,
  vuexblazePlugin
}
