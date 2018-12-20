import { setToPath, addToCollectionPath, removeFromCollectionPath, modifyCollectionPath } from '../mutations'

export default class VuexBlazeCollectionChange {

  constructor(innerObserver) {
    this.innerObserver = innerObserver
    this.elementChanges = []
  }

  push(elementChange) {
    this.elementChanges.push(elementChange)
  }

  async applyTo({ commit, state }, stateName) {
    
    this.elementChanges.map(({ type, index, oldIndex, newIndex, doc, path }) => {
      const collectionPath = [stateName, ...path.get()]
      if (type == 'added') {
        addToCollectionPath(commit, state, collectionPath, index, doc)
      } else if (type == 'removed') {
        removeFromCollectionPath(commit, state, collectionPath, index)
      } else if (type == 'modified') {
        modifyCollectionPath(commit ,state, collectionPath,  oldIndex, newIndex, doc)
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