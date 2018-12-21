import { actionNamer } from '../utils'
import { isString } from 'lodash'
import { VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE } from '../options'
import VuexBlazeDoc from './VuexBlazeDoc'
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

  doc() {
    return new VuexBlazeDoc(this.collectionName)
  }

  bindTo(stateName, userOptions) {
    const self = this
    const options = { ...this.DEFAULT_OPTIONS, ...userOptions }
    let binder = null
    const actionName = actionNamer(VuexBlazeConfig.get('actionNameCase'))

    return {
      async [actionName('bind', stateName)](context) {
        const $firestore = this.$firestore || this.$fireStore
        const collectionRef = $firestore.collection(self.collectionName)
        binder = new VuexBlazeCollectionBinder(
          context,
          stateName,
          collectionRef,
          self.filterName,
          self.queries,
          options
        )
        return await binder.bind()
      },
      async [actionName('increment', stateName)]() {
        if (!binder) throw new Error('Not binded')
        await binder.increment()
      },
      async [actionName('unbind', stateName)]() {
        if (binder) {
          binder.unbind()
          binder = null
        }
      },
      async [actionName('reload', stateName)]() {
        if (!binder) throw new Error('Not binded')
        await binder.reload()
      },
      async [actionName('updateDocIn', stateName)](context, payload) {
        if (!binder) throw new Error('Not binded')
        const [id, data] = Array.isArray(payload)
          ? payload
          : [payload.id, { ...payload }]
        delete data.id
        if (!id) throw new Error('"id" is required to update doc')
        await binder.collectionRef.doc(id).set(data, { merge: true })
      },
      async [actionName('addDocTo', stateName)](context, payload) {
        if (Array.isArray(payload)) {
          const [id, data] = payload
          await binder.collectionRef.doc(id).set(data)
        } else if (payload.id) {
          const id = payload.id
          const data = { ...payload }
          delete data.id
          await binder.collectionRef.doc(id).set(data)
        } else {
          await binder.collectionRef.add(payload)
        }
      },
      async [actionName('deleteDocFrom', stateName)](context, payload) {
        const id = isString(payload) ? payload : payload.id
        if (!id) throw new Error('"id" is required to update doc')
        await binder.collectionRef.doc(id).delete()
      }
    }
  }

  filterBy(filterName) {
    this.filterName = filterName
    return this
  }
}
VuexBlazeCollection.prototype.FIRESTORE_METHODS = [
  'where',
  'orderBy',
  'startAt',
  'startAfter',
  'endAt',
  'endBefore',
  'limit'
]
VuexBlazeCollection.prototype.DEFAULT_OPTIONS = {
  refDepth: 2,
  onUncontrollableChange: VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE
}
