

import VuexBlazeDoc from './classes/VuexBlazeDoc'
import VuexBlazeCollection from './classes/VuexBlazeCollection'
import vuexblazeMutations from './mutations'
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
  vuexblazeMutations,
  vuexblazeTypes,
  vuexblazeOptions
}
