import VuexBlazeInnerCollectionObserver from './VuexBlazeInnerCollectionObserver'
import { last } from 'lodash'

export default class VuexBlazeCollectionObserver {

  constructor($firestore, collectionName) {
    this.$firestore = $firestore
    this.collectionName = collectionName
    this.changeCallbacks = []
    this.destructiveChangeCallbacks = []
    this.unsubscribes = []
    this.queries = []
    this.innerCollectionObservers = []
  }

  clone() {
    const clone = new VuexBlazeCollectionObserver(this.$firestore, this.collectionName)
    clone.changeCallbacks = this.changeCallbacks
    clone.destructiveChangeCallbacks = this.destructiveChangeCallbacks
    return clone
  }

  async observe(queries) {
    this.queries = queries
    let collectionRef = this.$firestore.collection(this.collectionName)
    this.queries.forEach(([query, args]) => {
      collectionRef = collectionRef[query](...args)
    })
    const inner = new VuexBlazeInnerCollectionObserver(this, collectionRef)
    this.innerCollectionObservers.push(inner)
    await inner.observe()
  }

  async next() {
    let collectionRef = this.$firestore.collection(this.collectionName)
    this.queries.forEach(([query, args]) => {
      if (['where', 'orderBy', 'limit'].includes(query)) {
        collectionRef = collectionRef[query](...args)
      }
    })
    collectionRef = collectionRef.startAfter(last(this.innerCollectionObservers).lastDoc)
    const inner = new VuexBlazeInnerCollectionObserver(this, collectionRef)
    this.innerCollectionObservers.push(inner)
    await inner.observe()
  }

  onChange(callback) {
    this.changeCallbacks.push(callback)
  }

  onDestructiveChange(callback) {
    this.destructiveChangeCallbacks.push(callback)
  }

  notifyDestructiveChange() {
    this.destructiveChangeCallbacks.forEach(callback => callback())
  }

  notifyChange(innerCollectionObserver) {
    const innerColletionIndex = this.innerCollectionObservers.indexOf(innerCollectionObserver)
    this.changeCallbacks.forEach(callback => 
      callback(innerColletionIndex, innerCollectionObserver.collection)
    )
  }

  stop() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe())
  }

}