import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from './types'

import VuexBlazeDoc from './classes/VuexBlazeDoc'
import VuexBlazeCollection from './classes/VuexBlazeCollection'

function doc(collectionName) {
  return new VuexBlazeDoc(collectionName)
}

function collection(collectionName) {
  return new VuexBlazeCollection(collectionName)
}
 
const vuexblazeMutations = {
  [VUEXBLAZE_SET_VALUE] (state, { target, name, data }) {
    target[name] = data
  },
  [VUEXBLAZE_COLLECTION_ADD] (state, { newIndex, data, target }) {
    target.splice(newIndex, 0, data)
  },
  [VUEXBLAZE_COLLECTION_REMOVE] (state, { oldIndex, target }) {
    return target.splice(oldIndex, 1)[0]
  },
  [VUEXBLAZE_COLLECTION_SPLICE] (state, { target, index, howMany, elements } ) {
    return target.splice(index, howMany, ...elements)
  }
}

export {
  doc,
  collection,
  vuexblazeMutations
}
