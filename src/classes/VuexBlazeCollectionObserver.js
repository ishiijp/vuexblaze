import { last, remove } from 'lodash'
import VuexBlazeInnerCollectionObserver from './VuexBlazeInnerCollectionObserver';

export default class VuexBlazeCollectionObserver {

  constructor(collectionRef, queries, paths, options) {
    this.collectionRef = collectionRef
    this.queries = queries
    this.paths = paths
    this.options = options
    this.innerObservers = []
    this.changeCallbacks = []
    this.destructiveChangeCallbacks = []
    this.isFirst = true
  }

  async observe() {
    let ref = this.collectionRef
    this.queries.forEach(([query, args]) => {
      ref = ref[query](...args)
    })
    const inner = new VuexBlazeInnerCollectionObserver(this, ref, this.paths, this.options)
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
    const inner = new VuexBlazeInnerCollectionObserver(this, ref, this.paths, this.options)
    this.innerObservers.push(inner)
    await inner.observe()
    if (inner.length == 0) {
      inner.stop()
      remove(this.innerObservers, o => o === inner)
    }
  }

  get isIncremented() {
    return !!this.innerObservers.length
  }

  onChange(callback) {
    this.changeCallbacks.push(callback)
  }

  onDestructiveChange(callback) {
    this.destructiveChangeCallbacks.push(callback)
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

  notifyDestructiveChange() {
    this.destructiveChangeCallbacks.forEach(callback => callback())
  }

  startIndexOf(innerObserver) {
    const innerIndex = this.innerObservers.indexOf(innerObserver)
    return this.innerObservers.slice(0, innerIndex)
      .reduce((sum, info) => {
        return sum + info.length
      }, 0)
  }

}