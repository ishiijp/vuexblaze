import { actionNamer } from '../utils'
import { isString } from 'lodash'
import { VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE } from '../options'
import VuexBlazeDoc from './VuexBlazeDoc'
import VuexBlazeCollectionBinder from './VuexBlazeCollectionBinder'
import VuexBlazeConfig from './VuexBlazeConfig'
import VuexBlazeQueryBuilder from './VuexBlazeQueryBuilder'

export default class VuexBlazeCollection {
  constructor(collectionName) {
    this.collectionName = collectionName
    this.queryBuilder = VuexBlazeQueryBuilder.createFromProxy(this)
  }

  doc() {
    return new VuexBlazeDoc(this.collectionName)
  }

  bind(userOptions) {
    return this.bindTo(this.collectionName, userOptions)
  }

  bindTo(stateName, userOptions) {
    const options = { ...this.DEFAULT_OPTIONS, ...userOptions }
    let binder = null
    const actionName = actionNamer(VuexBlazeConfig.get('actionNameCase'))

    return {
      [actionName('bind', stateName)]: async context => {
        const $firestore = context.rootGetters['vuexblaze/$firestore']
        const collectionRef = $firestore.collection(this.collectionName)
        binder = new VuexBlazeCollectionBinder(
          context,
          stateName,
          collectionRef,
          this.queryBuilder,
          options
        )
        return await binder.bind()
      },
      [actionName('increment', stateName)]: async () => {
        if (!binder) throw new Error('Not binded')
        await binder.increment()
      },
      [actionName('unbind', stateName)]: async () => {
        if (binder) {
          binder.unbind()
          binder = null
        }
      },
      [actionName('reload', stateName)]: async () => {
        if (!binder) throw new Error('Not binded')
        await binder.reload()
      },
      [actionName('updateDocIn', stateName)]: async (context, payload) => {
        if (!binder) throw new Error('Not binded')
        const [id, data] = Array.isArray(payload)
          ? payload
          : [payload.id, { ...payload }]
        delete data.id
        if (!id) throw new Error('"id" is required to update doc')
        await binder.collectionRef.doc(id).set(data, { merge: true })
      },
      [actionName('addDocTo', stateName)]: async (context, payload) => {
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
      [actionName('deleteDocFrom', stateName)]: async (context, payload) => {
        const id = isString(payload) ? payload : payload.id
        if (!id) throw new Error('"id" is required to update doc')
        await binder.collectionRef.doc(id).delete()
      }
    }
  }

  filter(builder) {
    this.queryBuilder = new VuexBlazeQueryBuilder(builder)
    return this
  }
}

VuexBlazeCollection.prototype.DEFAULT_OPTIONS = {
  refDepth: 2,
  onUncontrollableChange: VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE
}
