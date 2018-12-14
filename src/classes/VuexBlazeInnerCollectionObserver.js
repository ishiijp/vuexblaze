import { once, last } from 'lodash'
import VuexBlazeDocSnapshot from './VuexBlazeDocSnapshot'

export default class VuexBlazeInnerCollectionObserver {

  constructor(parent, collectionRef) {
    this.parent = parent
    this.collectionRef = collectionRef
    this.collection = []
  }

  async observe() {
    return new Promise((resolve, reject) => {
      const resolveOnce = once(resolve)
      const rejectOnce = once(reject)
      let isFirst = true
      let changes = []

      const unsubscribe = this.collectionRef.onSnapshot({includeMetadataChanges: true}, 
        async querySnapshot => {
          changes = changes.concat(querySnapshot.docChanges())
          if (querySnapshot.metadata.fromCache) return

          if (isFirst) {
            isFirst = false
            if (!changes.length) {
              unsubscribe()
              rejectOnce()
            } else {
              await this._processQuerySnapshot(querySnapshot, changes)
              changes = []
              this.parent.notifyChange(this)
              resolveOnce()
            }
          } else {
            const { added, removed } = this._inspectChanges(changes)
            if (added && removed) {
              this.parent.notifyDestructiveChange()
              unsubscribe()
            } else {
              await this._processQuerySnapshot(querySnapshot, changes)
              this.parent.notifyChange(this)
              changes = []
            }
          }
        }, rejectOnce)
      this.parent.unsubscribes.push(unsubscribe)
    })
  }

  async _processQuerySnapshot(querySnapshot, changes) {
    changes.forEach(async change => {
      switch(change.type) {
        case 'added': 
          this.collection.splice(change.newIndex, 0, await (new VuexBlazeDocSnapshot(this.parent.$firestore, change.doc, 1)).fetch())
          return
        case 'removed': 
          this.collection.splice(change.oldIndex, 1)
          return
        case 'modified': 
          this.collection.splice(change.oldIndex, 1)
          this.collection.splice(change.newIndex, 0, await (new VuexBlazeDocSnapshot(this.parent.$firestore, change.doc, 1)).fetch())
          return
      }
    })
    this.length = querySnapshot.size
    this.firstDoc = querySnapshot.docs[0]
    this.lastDoc = last(querySnapshot.docs)
  }

  _inspectChanges(changes) {
    return changes.reduce((result, change) => {
      result[change.type] = true
      return result
    }, { added: false, removed: false, modified: false })
  }


}