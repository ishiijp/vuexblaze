import { actionName } from '../utils'
import { VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE } from '../options'
import VuexBlazeCollectionBinder from './VuexBlazeCollectionBinder'

export default class VuexBlazeCollection {

  constructor(collectionName) {
    this.collectionName = collectionName
    this.filterName = null
    this.queries = []

    this.FIRESTORE_METHODS.forEach(methodName => {
      this[methodName] = (...args) => {
        this.queries.push([methodName, args])
        return this
      }
    })
  }

  bindTo(stateName, userOptions) {
    const self = this
    const options = { ...this.DEFAULT_OPTIONS, ...userOptions }
    let binder = null
    return {
      async [actionName('bind', stateName)](context) {
        const $firestore = this.$firestore || this.$fireStore
        const collectionRef = $firestore.collection(self.collectionName)
        binder = new VuexBlazeCollectionBinder(context, stateName, collectionRef, self.filterName, self.queries, options)
        return await binder.bind()
      },
      async [actionName('increment', stateName)]() {
        await binder.increment()
      },
      async [actionName('unbind', stateName)] () {
        binder.unbind()
        binder = null
      },
      async [actionName('reload', stateName)]() {
        await binder.reload()
      }
    }
  }

  filterBy(filterName) {
    this.filterName = filterName
    return this
  }
}
VuexBlazeCollection.prototype.FIRESTORE_METHODS = ['where', 'orderBy', 'startAt', 'startAfter', 'endAt', 'endBefore','limit']
VuexBlazeCollection.prototype.DEFAULT_OPTIONS = {
  refDepth: 2,
  onUncontrollableChange: VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE
}