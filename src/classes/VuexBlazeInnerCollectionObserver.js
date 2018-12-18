import { once, last } from 'lodash'
import VuexBlazeDocObserver from './VuexBlazeDocObserver'

export default class VuexBlazeInnerCollectionObserver {

  constructor(parent, collectionRef, paths, refDepth) {
    this.parent = parent
    this.collectionRef = collectionRef
    this.paths = paths
    this.refDepth = refDepth
    this.children = []
    this.changeCallbacks = []
    this.isFirst = true
    this.unsubscribe = null
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

          if (this.isFirst) {
            this.isFirst = false
            const [changes, observers] = this._processQuerySnapshot(querySnapshot, docChanges)
            this.children = observers

            const collection = this.constructor.createCollectionFromChanges(changes)

            await Promise.all(this.children.map(child => {
              child.onChange(childChange => {
                if (this.isFirst) {
                  set(collection, childChange.paths.slice(-2), childChange.data)
                } else {
                  this.notifyChange(childChange)
                }
              })
              return child.observe()
            }))
            this.notifyChange({ paths: this.paths, data: collection })
            resolveOnce()
          } else {
            const { added, removed } = this.constructor.inspectChanges(docChanges)
            if (added && removed) {
              this.parent.notifyDestructiveChange()
              this.unsubscribe()
            } else {
              const [changes, observers] =  this._processQuerySnapshot(querySnapshot, docChanges)
              observers.forEach(observer => {
                observer.onChange(childChange => {
                  this.notifyChange(childChange)
                })
                return observer.observe()
              })
              changes.forEach(change => this.notifyChange(change))
            }
          }
        }, rejectOnce)
    })
  }

  _processQuerySnapshot(querySnapshot, docChanges) {
    const changes = []
    const observers = []
    docChanges.forEach(docChange => {
      switch(docChange.type) {
        case 'added': 
          let [change, childObservers] = VuexBlazeDocObserver.processDocSnapshot(docChange.doc, [...this.paths, docChange.newIndex], this.refDepth)
          changes.push({ ...change, type: 'add' })
          Array.prototype.push.apply(observers, childObservers)
          return
        case 'removed': 
          changes.push({ paths: [...this.paths, docChange.oldIndex], type: 'remove' })
          return
        case 'modified': 
          [change, childObservers] = VuexBlazeDocObserver.processDocSnapshot(docChange.doc, [...this.paths, docChange.newIndex], this.refDepth)
          changes.push({ ...change, type: 'modify' })
          Array.prototype.push.apply(observers, childObservers)
          return
      }
    })
    this.length = querySnapshot.size
    this.firstDoc = querySnapshot.docs[0]
    this.lastDoc = last(querySnapshot.docs)
    return [changes, observers]
  }

  onChange(callback) {
    this.changeCallbacks.push(callback)
  }

  stop() {
    this.unsubscribe()
    this.children.forEach(child => {
      child.unsubscribe()
    })
    this.children = []
  }

  static createCollectionFromChanges(changes) {
    return changes.reduce((collection, change) => {
      switch(change.type) {
        case 'add':
          collection.splice(last(change.paths), 0, change.data)
          break
        case 'remove':
          collection.splice(last(change.paths), 1)
          break
        case 'modify':
          collection.splice(last(change.paths), 1, change.data)
          break
      }
      return collection
    })
  }

  static inspectChanges(changes) {
    return changes.reduce((result, change) => {
      result[change.type] = true
      return result
    }, { added: false, removed: false, modified: false })
  }


}