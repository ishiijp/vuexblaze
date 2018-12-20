import { setToPath, addToCollectionPath, removeFromCollectionPath, modifyCollectionPath } from '../mutations'
import { flatten } from 'lodash'

export default class VuexBlazeCollectionChange {

  constructor(innerObserver) {
    this.innerObserver = innerObserver
    this.elementChanges = []
  }

  push(elementChange) {
    this.elementChanges.push(elementChange)
  }

  async applyTo({ commit, state }, stateName) {
    
    this.elementChanges.map(({ type, index, oldIndex, newIndex, processor }) => {
      const parentPath = [stateName, ...processor.path.get().splice(0, -1)]
      if (type == 'added') {
        addToCollectionPath(commit, state, parentPath, index, processor.doc)
      } else if (type == 'removed') {
        removeFromCollectionPath(commit, state, parentPath, index)
      } else if (type == 'modified') {
        modifyCollectionPath(commit ,state, parentPath,  oldIndex, newIndex, processor.doc)
      }
    })

    await Promise.all(
      this.innerObserver.childObservers
      .filter(o => !o.observing)
      .map(o =>  {
        o.onChange(change => {
          setToPath(commit, state, [stateName, ...change.observer.path.get()], change.observer.currentDoc)
        })
        return o.observe()
      }))

  }

}