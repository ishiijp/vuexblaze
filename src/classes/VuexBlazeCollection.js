import { actionNamer } from '../utils'
import { isString, set } from 'lodash'
import { VUEXBLAZE_IGNORE_ON_UNCONTROLLABLE_CHANGE } from '../options'
import VuexBlazeDoc from './VuexBlazeDoc'
import VuexBlazeCollectionBinder from './VuexBlazeCollectionBinder'
import VuexBlazeConfig from './VuexBlazeConfig'
import VuexBlazeQueryBuilder from './VuexBlazeQueryBuilder'
import VuexBlazeDocSnapshotProcessor from './VuexBlazeDocSnapshotProcessor'
import VuexBlazePath from './VuexBlazePath'
import { singular } from 'pluralize'

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

  crud(userBaseName, userOptions) {
    const options = { ...this.DEFAULT_OPTIONS, ...userOptions }
    const baseName = userBaseName || singular(this.collectionName)
    const actionName = actionNamer(VuexBlazeConfig.get('actionNameCase'))
    const getRefFromContext = context => {
      const $firestore = context.rootGetters['vuexblaze/$firestore']
      return $firestore.collection(this.collectionName)
    }

    return {
      [actionName('create', baseName)]: async (context, payload) => {
        const collectionRef = getRefFromContext(context)
        if (Array.isArray(payload)) {
          const [id, data] = payload
          await collectionRef.doc(id).set(data)
        } else if (payload.id) {
          const id = payload.id
          const data = { ...payload }
          delete data.id
          await collectionRef.doc(id).set(data)
        } else {
          await collectionRef.add(payload)
        }
      },
      [actionName('retrieve', baseName)]: async (context, id) => {
        const collectionRef = getRefFromContext(context)
        const snapshot = await collectionRef.doc(id).get()

        const processor = new VuexBlazeDocSnapshotProcessor(
          null,
          snapshot,
          VuexBlazePath.createRoot(options),
          options
        )
        processor.process()
        await Promise.all(
          Object.values(processor.refObservers).map(observer => {
            observer.onChange(change => {
              set(
                processor.doc,
                change.observer.path.get(),
                change.observer.currentDoc
              )
              observer.stop()
            })
            return observer.observe()
          })
        )
        return processor.doc
      },
      [actionName('update', baseName)]: async (context, payload) => {
        const collectionRef = getRefFromContext(context)
        const [id, data] = Array.isArray(payload)
          ? payload
          : [payload.id, { ...payload }]
        delete data.id
        if (!id) throw new Error('"id" is required to update doc')
        await collectionRef.doc(id).set(data, { merge: true })
      },
      [actionName('delete', baseName)]: async (context, payload) => {
        const collectionRef = getRefFromContext(context)
        const id = isString(payload) ? payload : payload.id
        if (!id) throw new Error('"id" is required to update doc')
        await collectionRef.doc(id).delete()
      }
    }
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
