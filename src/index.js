import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_SET_PATH_DATA,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from './types'

import VuexBlazeDoc from './classes/VuexBlazeDoc'
import VuexBlazeCollection from './classes/VuexBlazeCollection'
import { set } from 'lodash'

function doc(collectionName) {
  return new VuexBlazeDoc(collectionName)
}

function collection(collectionName) {
  return new VuexBlazeCollection(collectionName)
}
 
const vuexblazeMutations = {
  [VUEXBLAZE_SET_VALUE] (rootState, { target, name, data }) {
    target[name] = data
  },
  [VUEXBLAZE_SET_PATH_DATA] (rootState, { state, paths, data }) {
    set(state, paths, data)
  },
  [VUEXBLAZE_COLLECTION_ADD] (rootState, { newIndex, data, target }) {
    target.splice(newIndex, 0, data)
  },
  [VUEXBLAZE_COLLECTION_REMOVE] (rootState, { oldIndex, target }) {
    return target.splice(oldIndex, 1)[0]
  },
  [VUEXBLAZE_COLLECTION_SPLICE] (rootState, { target, index, howMany, elements } ) {
    return target.splice(index, howMany, ...elements)
  }
}

export {
  doc,
  collection,
  vuexblazeMutations
}
