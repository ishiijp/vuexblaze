import { actionNamer } from '../utils'
import VuexBlazeDocBinder from './VuexBlazeDocBinder'
import VuexBlazeConfig from './VuexBlazeConfig'

export default class VuexBlazeDoc {
  constructor(collectionName) {
    this.collectionName = collectionName
  }

  bindTo(stateName, userOptions) {
    const options = { refDepth: 1, ...userOptions }
    let binder = null
    const actionName = actionNamer(VuexBlazeConfig.get('actionNameCase'))

    return {
      [actionName('bind', stateName)]: async (context, docId) => {
        const $firestore = context.rootGetters['vuexblaze/$firestore']
        const docRef = $firestore.collection(this.collectionName).doc(docId)
        binder = new VuexBlazeDocBinder(context, stateName, docRef, options)
        return binder.bind()
      },
      [actionName('unbind', stateName)]: async () => {
        if (!binder) {
          throw new Error('Not binded')
        }
        binder.unbind()
        binder = null
      },
      [actionName('update', stateName)]: async (context, data) => {
        if (!binder) {
          throw new Error('Not binded')
        }
        await binder.docRef.set(data, { merge: true })
      }
    }
  }
}
