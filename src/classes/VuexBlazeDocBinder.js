import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from '../types'

export default class VuexBlazeDocBinder {
  
  constructor(observer, context, stateName) {
    this.observer = observer
    this.context = context
    this.stateName = stateName
  }

  async bind() {
    this.observer.onChange(doc => this._setDoc(doc))
    await this.observer.observe()
    return this
  }

  unbind() {
    this.observer.stop()
    this._setDoc(null)
  }

  _setDoc(doc) {
    this.context.commit(
      VUEXBLAZE_SET_VALUE, 
      { target: this.context.state, name: this.stateName, data: doc}, 
      { root: true }
    )
  }
}