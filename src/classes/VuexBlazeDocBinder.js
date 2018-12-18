import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_SET_PATH_DATA,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from '../types'
import VuexBlazeDocObserver from './VuexBlazeDocObserver';

export default class VuexBlazeDocBinder {
  
  constructor(context, stateName, docRef) {
    this.docRef = docRef
    this.context = context
    this.stateName = stateName
    this.observer = new VuexBlazeDocObserver(docRef, [], 1)
  }

  async bind() {
    this.observer.onChange(change => this._setChange(change))
    await this.observer.observe()
    return this
  }

  unbind() {
    this.observer.stop()
    this._setChange({ paths: [], data:null })
  }

  _setChange({ paths, data }) {
    this.context.commit(
      VUEXBLAZE_SET_PATH_DATA, 
      { state: this.context.state, paths: [this.stateName, ...paths], data }, 
      { root: true }
    )
  }
}