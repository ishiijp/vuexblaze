import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from '../types'
import VuexBlazeCollectionObserver from './VuexBlazeCollectionObserver';

export default class VuexBlazeCollectionBinder {

  constructor(context, stateName, collectionRef, filterName, queries) {
    this.context = context
    this.stateName = stateName
    this.collectionRef = collectionRef
    this.filterName = filterName
    this.destructiveChangeCallbacks = []
    this.queries = queries
    this.observer = new VuexBlazeCollectionObserver(
      collectionRef, this._getQueries(), [], 2
    )
  }

  get collection() {
    return this.context.state[this.stateName]
  }

  async bind() {
    this.observer.onChange(async change => 
      await change.applyTo(this.context, this.stateName)  
    )
    this.observer.onDestructiveChange(() => {
      this.destructiveChangeCallbacks.forEach(callback => callback())
    })
    await this.observer.observe()
    return this
  }

  async increment() {
    await this.observer.increment()
  }

  async reload() {
    this.observer.stop()
    this.observer = new VuexBlazeCollectionObserver(
      collectionRef, this._getQueries(), [], 2
    )
    this._replaceCollection(0, this.collection.length)
    await this.bind()
  }

  unbind() {
    this.observer.stop()
    this.destructiveChangeCallbacks = []
    this.innerCollectionInfos = []
    this._replaceCollection(0, this.collection.length)
  }

  onDestructiveChange(callback) {
    this.destructiveChangeCallbacks.push(callback)
  }

  _getQueries() {
    if (this.filterName && this.queries.length) {
      throw new Error('Duplicate query settings')
    }
    if (this.filterName) {
      return this.context.getters[this.filterName].map(([methodName, args]) => { 
        return Array.isArray(args) ? [methodName, args] : [methodName, [args]]
      })
    } else {
      return this.queries.slice(0)
    }
  }

  _replaceCollection(index, howMany, elements = []) {
    this.context.commit(
      VUEXBLAZE_COLLECTION_SPLICE,
      {
        target: this.collection, 
        index,
        howMany,
        elements
      },
      { root: true }
    )
  }

}