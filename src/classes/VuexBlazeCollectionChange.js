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
    const startIndex = this.innerObserver.startIndex
    const paths = [stateName, ...this.innerObserver.paths]
    
    await Promise.all(this.elementChanges.map(({ type, index, oldIndex, newIndex, observer }) => {
      observer.onChange(() => {
        if (type == 'added') {
          addToCollectionPath(commit, state, paths, startIndex + index, observer.currentDoc)
        } else if (type == 'removed') {
          removeFromCollectionPath(commit, state, paths, startIndex + index)
        } else if (type == 'modified') {
          modifyCollectionPath(commit ,state, paths, startIndex + oldIndex, startIndex + newIndex, observer.currentDoc)
        }
      })
      return observer.observe()
    }))

    await Promise.all(
      flatten(this.innerObserver.childObservers.map(o => o.childObservers))
      .filter(o => !o.observing)
      .map(o =>  {
        o.onChange(change => {
          setToPath(commit, state, [stateName, ...change.observer.paths], change.observer.currentDoc)
        })
        return o.observe()
      }))

  }

}