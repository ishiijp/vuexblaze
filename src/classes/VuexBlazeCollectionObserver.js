import { last, remove } from 'lodash'
import VuexBlazeCollectionInnerObserver from './VuexBlazeCollectionInnerObserver'

export default class VuexBlazeCollectionObserver {
  constructor(collectionRef, queries, path, options) {
    this.collectionRef = collectionRef
    this.queries = queries
    this.path = path
    this.options = options
    this.innerObservers = []
    this.changeCallbacks = []
    this.uncontrollableChangeCallbacks = []
    this.isFirst = true
  }

  async observe() {
    let ref = this.collectionRef
    this.queries.forEach(([query, args]) => {
      ref = ref[query](...args)
    })
    const inner = new VuexBlazeCollectionInnerObserver(
      this,
      ref,
      this.path,
      this.options
    )
    this.innerObservers.push(inner)
    await inner.observe()
  }

  async increment() {
    let ref = this.collectionRef
    this.queries.forEach(([query, args]) => {
      if (['where', 'orderBy', 'limit'].includes(query)) {
        ref = ref[query](...args)
      }
    })
    ref = ref.startAfter(last(this.innerObservers).lastDoc)
    const inner = new VuexBlazeCollectionInnerObserver(
      this,
      ref,
      this.path,
      this.options
    )
    this.innerObservers.push(inner)
    await inner.observe()
    if (inner.length === 0) {
      inner.stop()
      remove(this.innerObservers, o => o === inner)
    }
  }

  get incremented() {
    return 1 < this.innerObservers.length
  }

  onChange(callback) {
    this.changeCallbacks.push(callback)
  }

  onUncontrollableChange(callback) {
    this.uncontrollableChangeCallbacks.push(callback)
  }

  stop() {
    this.innerObservers.forEach(observer => {
      observer.stop()
    })
    this.innerObservers = []
  }

  notifyChange(change) {
    this.changeCallbacks.forEach(callback => callback(change))
  }

  notifyUncontrollableChange() {
    this.uncontrollableChangeCallbacks.forEach(callback => callback())
  }

  startIndexOf(innerObserver) {
    const innerIndex = this.innerObservers.indexOf(innerObserver)
    return this.innerObservers
      .slice(0, innerIndex)
      .reduce((sum, info) => sum + info.length, 0)
  }
}
