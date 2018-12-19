import {
  VUEXBLAZE_SET_PATH,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_MODIFY,
  VUEXBLAZE_COLLECTION_CLEAR
} from './types'

import { set, get } from 'lodash'

export const vuexblazeMutations = {
  [VUEXBLAZE_SET_PATH] (rootState, { state, paths, data }) {
    set(state, paths, data)
  },
  [VUEXBLAZE_COLLECTION_ADD] (rootState, { collection, index, data }) {
    collection.splice(index, 0, data)
  },
  [VUEXBLAZE_COLLECTION_REMOVE] (rootState, { collection, index }) {
    collection.splice(index, 1)
  },
  [VUEXBLAZE_COLLECTION_MODIFY] (rootState, { collection, oldIndex, newIndex, data, }) {
    collection.splice(oldIndex, 1)
    collection.splice(newIndex, 0, data)
  },
  [VUEXBLAZE_COLLECTION_CLEAR] (rootState, { collection }) {
    collection.splice(0, collection.length)
  }
}

export const setToPath = (commit, state, paths, data) => {
  commit(
    VUEXBLAZE_SET_PATH, 
    { state, paths, data }, 
    { root: true }
  )
}

export const addToCollectionPath = (commit, state, paths, index, data) => {
  commit(
    VUEXBLAZE_COLLECTION_ADD,
    { collection: get(state, paths) , index, data },
    { root: true }
  )
}

export const removeFromCollectionPath = (commit, state, paths, index) => {
  commit(
    VUEXBLAZE_COLLECTION_REMOVE,
    { collection: get(state, paths), index },
    { root: true }
  )
}

export const modifyCollectionPath = (commit, state, paths, oldIndex, newIndex, data) => {
  commit(
    VUEXBLAZE_COLLECTION_MODIFY,
    { collection: get(state, paths), oldIndex, newIndex, data },
    { root: true }
  )
}

export const clearCollectionPath = (commit, state, paths) => {
  commit(
    VUEXBLAZE_COLLECTION_CLEAR,
    { collection: get(state, paths) },
    { root: true }
  )
}

