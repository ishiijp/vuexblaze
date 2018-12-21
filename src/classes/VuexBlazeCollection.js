import { actionNamer } from '../utils'
import { VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE } from '../options'
import VuexBlazeCollectionBinder from './VuexBlazeCollectionBinder'
import VuexBlazeConfig from './VuexBlazeConfig'

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
    const actionName = actionNamer(VuexBlazeConfig.get('actionNameCase'))

    return {
      async [actionName('bind', stateName)](context) {
        if (binder) throw new Error('Already binded')
        const $firestore = this.$firestore || this.$fireStore
        const collectionRef = $firestore.collection(self.collectionName)
        binder = new VuexBlazeCollectionBinder(context, stateName, collectionRef, self.filterName, self.queries, options)
        return await binder.bind()
      },
      async [actionName('increment', stateName)]() {
        if (!binder) throw new Error('Not binded')
        await binder.increment()
      },
      async [actionName('unbind', stateName)] () {
        if (binder) {
          binder.unbind()
          binder = null
        }
      },
      async [actionName('reload', stateName)]() {
        if (!binder) throw new Error('Not binded')
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