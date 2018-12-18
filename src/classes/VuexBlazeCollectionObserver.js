import { once, last } from 'lodash'
import VuexBlazeInnerCollectionObserver from './VuexBlazeInnerCollectionObserver';

export default class VuexBlazeCollectionObserver {

  constructor(collectionRef, queries, paths, refDepth) {
    this.collectionRef = collectionRef
    this.queries = queries
    this.paths = paths
    this.refDepth = refDepth
    this.children = []
    this.changeCallbacks = []
    this.unsubscribes = []
    this.isFirst = true
  }

  async observe() {
    let ref = this.collectionRef
    this.queries.forEach(([query, args]) => {
      ref = ref[query](...args)
    })
    const inner = new VuexBlazeInnerCollectionObserver(ref, paths, refDepth)
    inner.onChange(change => this._notifyChange(change))
    this.children.push(inner)
    await inner.observe()
  }

  async increment() {
    let ref = this.collectionRef
    this.queries.forEach(([query, args]) => {
      if (['where', 'orderBy', 'limit'].includes(query)) {
        ref = ref[query](...args)
      }
    })
    ref = ref.startAfter(last(this.children).lastDoc)
    const inner = new VuexBlazeInnerCollectionObserver(ref, paths, refDepth)
    inner.onChange(change => this._notifyChange(change))
    this.children.push(inner)
    await inner.observe()
  }


  onChange(callback) {
    this.changeCallbacks.push(callback)
  }

  stop() {
    this.unsubscribe()
    this.children.forEach(child => {
      child.unsubscribe()
    })
    this.children = []
  }

  _notifyChange(change) {
    this.changeCallbacks.forEach(callback => callback(change))
  }

}