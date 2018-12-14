import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from '../types'

export default class VuexBlazeCollectionBinder {

  constructor(observer, context, stateName, filterName, queries) {
    this.observer = observer
    this.context = context
    this.stateName = stateName
    this.filterName = filterName
    this.destructiveChangeCallbacks = []
    this.innerCollectionInfos = []
    this.queries = queries || []
  }

  async bind() {
    this.observer.onChange((innerCollectionIndex, collection) => {
      const info = this._getInnerCollectionInfo(innerCollectionIndex)
      const startIndex = this._calcStartIndex(innerCollectionIndex)
      this._replaceCollection(startIndex, info.length, collection)
      info.length = collection.length
    })
    this.observer.onDestructiveChange(() => {
      this.destructiveChangeCallbacks.forEach(callback => callback())
    })
    await this.observer.observe(this._getQueries())
    return this
  }

  async increment() {
    await this.observer.next()
  }

  async reload() {
    this.observer.stop()
    this.observer = this.observer.clone()
    this.innerCollectionInfos = []
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

  get collection() {
    return this.context.state[this.stateName]
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

  _getInnerCollectionInfo(index) {
    if (this.innerCollectionInfos.length - 1 < index) {
      const info = { length: 0 }
      this.innerCollectionInfos.push(info)
      return info
    } else {
      return this.innerCollectionInfos[index]
    }
  }

  _calcStartIndex(innerCollectionIndex) {
    return this.innerCollectionInfos.slice(0, innerCollectionIndex)
      .reduce((sum, info) => {
        return sum + info.length
      }, 0)
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