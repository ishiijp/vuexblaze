import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_SET_PATH_DATA,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from '../types'

export default class VuexBlazeDocChange {

  constructor(observer) {
    this.observer = observer
  }

  async applyTo({ commit, state }, stateName) {
    this._setDataToPath(commit, state, [stateName, ...this.observer.paths], this.observer.currentDoc)
    
    await Promise.all(this.observer.childObservers
      .filter(o => !o.observing)
      .map(o =>  {
        o.onChange(change => {
          this._setDataToPath(commit, state, [stateName, ...change.observer.paths], change.observer.currentDoc)
        })
        o.observe()
      }))
  }

  _setDataToPath(commit, state, paths, data) {
    commit(
      VUEXBLAZE_SET_PATH_DATA, 
      { state, paths, data }, 
      { root: true }
    )
  }
}