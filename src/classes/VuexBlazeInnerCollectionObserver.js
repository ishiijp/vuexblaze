import { once, head, last } from 'lodash'
import VuexBlazeDocObserver from './VuexBlazeDocObserver'
import VuexBlazeCollectionChange from './VuexBlazeCollectionChange';

export default class VuexBlazeInnerCollectionObserver {

  constructor(parent, collectionRef, paths, options) {
    this.parent = parent
    this.collectionRef = collectionRef
    this.paths = paths
    this.options = options
    this.docObservers = []
    this.docSnapshots = []

    this.isFirst = true
    this.unsubscribe = null
  }

  get startIndex() {
    return this.parent.startIndexOf(this)
  }

  get childObservers() {
    return Object.values(this.docObservers)
  }

  get firstDoc() {
    return head(this.docSnapshots)
  }

  get lastDoc() {
    return last(this.docSnapshots)
  }

  get length() {
    return this.docSnapshots.length
  }

  observe() {
    return new Promise((resolve, reject) => {
      const resolveOnce = once(resolve)
      const rejectOnce = once(reject)
      let docChanges = []

      this.unsubscribe = this.collectionRef.onSnapshot({includeMetadataChanges: true}, 
        async querySnapshot => {
          docChanges = docChanges.concat(querySnapshot.docChanges())
          if (querySnapshot.metadata.fromCache) return

          const { added, removed } = this.constructor.inspectChanges(docChanges)
          const destructive = !this.isFirst && !this.parent.incremented && (added || removed)

          if (destructive) {
            this.notifyDestructiveChange()
          } else {
            const change = this._processDocChanges(docChanges)
            await this.notifyChange(change)
          }

          if (this.isFirst) {
            resolveOnce()
            this.isFirst = false
          }

          docChanges = []
        }, rejectOnce)
    })
  }

  _processDocChanges(docChanges) {

    docChanges.forEach(docChange => {
      switch(docChange.type) {
        case 'added':
          this.docSnapshots.splice(docChange.newIndex, 0, docChange.doc)
          break
        case 'removed':
          this.docSnapshots.splice(docChange.oldIndex, 1)
          break
        case 'modified':
          this.docSnapshots.splice(docChange.newIndex, 1, docChange.doc)
          break
      }
    })
    const change = new VuexBlazeCollectionChange(this)

    docChanges.forEach(docChange => {
      const resultIndex = this.docSnapshots.indexOf(docChange.doc)
      switch(docChange.type) {
        case 'added':
          const addedObsever = VuexBlazeDocObserver.createFromSnapshot(
            docChange.doc, [...this.paths, resultIndex], this.options
          )
          this.docObservers[docChange.doc.id] = addedObsever
          change.push({ type: docChange.type, index: docChange.newIndex, observer: addedObsever })
          break
        case 'removed':
          this.docObservers[docChange.doc.id].stop()
          delete this.docObservers[docChange.doc.id]
          change.push({ type: docChange.type, index: docChange.oldIndex })
          break
        case 'modified':
          const modifiedObserver = VuexBlazeDocObserver.createFromSnapshot(
            docChange.doc, [...this.paths, resultIndex], this.options, this.docObservers[docChange.doc.id]
          )
          change.push({ 
            type: docChange.type, 
            oldIndex: docChange.oldIndex,
            newIndex: docChange.newIndex, 
            observer: modifiedObserver 
          })
          break
      }
    })

    return change
  }

  notifyChange(change) {
    this.parent.notifyChange(change)
  }

  notifyDestructiveChange() {
    this.parent.notifyDestructiveChange()
  }

  stop() {
    this.unsubscribe()
    Object.values(this.docObservers).forEach(observer => {
      observer.stop()
    })
    this.docObservers = {}
    this.docSnapshots = []
  }

  static inspectChanges(changes) {
    return changes.reduce((result, change) => {
      result[change.type] = true
      return result
    }, { added: false, removed: false, modified: false })
  }

}