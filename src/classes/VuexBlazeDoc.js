import { actionName } from '../utils'
import VuexBlazeDocBinder from './VuexBlazeDocBinder'

export default class VuexBlazeDoc {

  constructor(collectionName) {
    this.collectionName = collectionName
  }

  bindTo(stateName, userOptions) {
    const self = this
    const options = { refDepth: 1, ...userOptions }
    let binder = null
    return {
      async [actionName('bind', stateName)](context, docId) {
        const $firestore = this.$firestore || this.$fireStore
        const docRef = $firestore.collection(self.collectionName).doc(docId)
        binder = new VuexBlazeDocBinder(context, stateName, docRef, options)
        return binder.bind()
      },
      async [actionName('unbind', stateName)] () {
        if (!binder) {
          throw new Error('Not binded')
        }
        binder.unbind()
        binder = null
      }
    }
  }
}