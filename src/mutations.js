import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_SET_PATH_DATA,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_MODIFY,
  VUEXBLAZE_COLLECTION_REPLACE,
  VUEXBLAZE_COLLECTION_SPLICE
} from './types'

import { set, get } from 'lodash'

export const vuexblazeMutations = {
  [VUEXBLAZE_SET_VALUE] (rootState, { target, name, data }) {
    target[name] = data
  },
  [VUEXBLAZE_SET_PATH_DATA] (rootState, { state, paths, data }) {
    set(state, paths, data)
  },
  [VUEXBLAZE_COLLECTION_ADD] (rootState, { collection, index, data }) {
    collection.splice(index, 0, data)
  },
  [VUEXBLAZE_COLLECTION_REMOVE] (rootState, { collection, index }) {
    collection.splice(index, 1)
  },
  [VUEXBLAZE_COLLECTION_REPLACE] (rootState, { collection, index, data, }) {
    collection.splice(index, 1, data)
  },
  [VUEXBLAZE_COLLECTION_MODIFY] (rootState, { collection, oldIndex, newIndex, data, }) {
    collection.splice(oldIndex, 1)
    collection.splice(newIndex, 0, data)
  },
  [VUEXBLAZE_COLLECTION_SPLICE] (rootState, { target, index, howMany, elements } ) {
    return target.splice(index, howMany, ...elements)
  }
}

export const setToPath = (commit, state, paths, data) => {
  commit(
    VUEXBLAZE_SET_PATH_DATA, 
    { state, paths, data }, 
    { root: true }
  )
}

export const addToPath = (commit, state, paths, index, data) => {
  commit(
    VUEXBLAZE_COLLECTION_ADD,
    { collection: get(state, paths) , index, data },
    { root: true }
  )
}

export const removeFromPath = (commit, state, paths, index) => {
  commit(
    VUEXBLAZE_COLLECTION_REMOVE,
    { collection: get(state, paths), index },
    { root: true }
  )
}

export const modifyPath = (commit, state, paths, oldIndex, newIndex, data) => {
  commit(
    VUEXBLAZE_COLLECTION_MODIFY,
    { collection: get(state, paths), oldIndex, newIndex, data },
    { root: true }
  )
}

export const replacePath = (commit, state, paths, index, data) => {
  commit(
    VUEXBLAZE_COLLECTION_REPLACE,
    { collection: get(state, paths), index, data },
    { root: true }
  )
}

