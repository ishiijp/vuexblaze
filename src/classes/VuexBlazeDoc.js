import { actionName } from '../utils'
import VuexBlazeDocBinder from './VuexBlazeDocBinder'
import VuexBlazeDocObserver from './VuexBlazeDocObserver'

export default class VuexBlazeDoc {

  constructor(collectionName) {
    this.collectionName = collectionName
  }

  bindTo(stateName) {
    const self = this
    let binder = null
    return {
      async [actionName('bind', stateName)](context, docId) {
        const $firestore = this.$firestore || this.$fireStore
        const observer = new VuexBlazeDocObserver($firestore, self.collectionName, docId)
        binder = new VuexBlazeDocBinder(observer, context, stateName)
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