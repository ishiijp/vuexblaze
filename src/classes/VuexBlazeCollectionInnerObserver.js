import { once, head, last, flatten } from 'lodash'
import VuexBlazeCollectionChange from './VuexBlazeCollectionChange';
import VuexBlazeDocSnapshotProcessor from './VuexBlazeDocSnapshotProcessor';

export default class VuexBlazeCollectionInnerObserver {

  constructor(parent, collectionRef, path, options) {
    this.parent = parent
    this.collectionRef = collectionRef
    this.path = path
    this.options = options
    this.docSnapshots = []
    this.docSnapshotProcessors = []

    this.isFirst = true
    this.unsubscribe = null
  }

  get startIndex() {
    return this.parent.startIndexOf(this)
  }

  get childObservers() {
    return flatten(
      Object.values(this.docSnapshotProcessors)
      .map(p => Object.values(p.refObservers))
    )
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
          const destructive = !this.isFirst && this.parent.incremented && (added || removed)

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

    docChanges.forEach(({ type, doc, newIndex, oldIndex }) => {
      switch(type) {
        case 'added':
          this.docSnapshots.splice(newIndex, 0, doc)
          break
        case 'removed':
          this.docSnapshots.splice(oldIndex, 1)
          break
        case 'modified':
          this.docSnapshots.splice(oldIndex, 1)
          this.docSnapshots.splice(newIndex, 0, doc)
          break
      }
    })
    const change = new VuexBlazeCollectionChange(this)

    docChanges.forEach(({ type, doc, newIndex, oldIndex }) => {
      const startIndex = this.startIndex
      const resultIndex = this.docSnapshots.indexOf(doc)
      if (type == 'added') {
        const processor = new VuexBlazeDocSnapshotProcessor(
          null,
          doc, 
          this.path.createChild(this.startIndex + resultIndex), 
          this.options
        )
        processor.process()
        this.docSnapshotProcessors[doc.id] = processor
        change.push({ 
          type, 
          doc: processor.doc, 
          path: this.path,
          index: startIndex + newIndex })
      } else if (type == 'removed') {
        this.docSnapshotProcessors[doc.id].stop()
        delete this.docSnapshotProcessors[doc.id]
        change.push({ 
          type, 
          path: this.path,
          index: startIndex + oldIndex 
        })
      } else if (type == 'modified') {
        const processor = new VuexBlazeDocSnapshotProcessor(
          this.docSnapshotProcessors[doc.id],
          doc,
          this.path.createChild(this.startIndex + resultIndex), 
          this.options
        )
        processor.process()
        change.push({
          type,
          doc: processor.doc,
          path: this.path,
          oldIndex: startIndex + oldIndex, 
          newIndex: startIndex + newIndex
        })
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
    Object.values(this.docSnapshotProcessors).forEach(p => p.stop())
    this.docSnapshotProcessors = {}
    this.docSnapshots = []
  }

  static inspectChanges(changes) {
    return changes.reduce((result, change) => {
      result[change.type] = true
      return result
    }, { added: false, removed: false, modified: false })
  }

}