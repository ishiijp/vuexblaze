import VuexBlazeDocSnapshot from './VuexBlazeDocSnapshot'
import { once } from 'lodash'

export default class VuexBlazeDocObserver {

  constructor($firestore, collectionName, docId) {
    this.$firestore = $firestore
    this.collectionName = collectionName
    this.docId = docId
    this.changeCallbacks = []
    this.unsubscribe = null
  }

  observe() {
    const docRef = this.$firestore.collection(this.collectionName).doc(this.docId)
    return new Promise((resolve, reject) => {
      const resolveOnce = once(resolve)
      this.unsubscribe = docRef.onSnapshot(async snapshot => {
        const data = await (new VuexBlazeDocSnapshot(this.$firestore, snapshot, 1)).fetch()
        this.changeCallbacks.forEach(callback => callback(data))
        resolveOnce
      }, reject)
    })
  }

  onChange(callback) {
    this.changeCallbacks.push(callback)
  }

  stop() {
    this.unsubscribe()
  }

}