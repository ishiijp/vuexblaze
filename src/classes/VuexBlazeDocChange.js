import { setToPath } from '../mutations'

export default class VuexBlazeDocChange {

  constructor(observer) {
    this.observer = observer
  }

  async applyTo({ commit, state }, stateName) {
    setToPath(commit, state, [stateName, ...this.observer.path.get()], this.observer.currentDoc)
    
    await Promise.all(this.observer.childObservers
      .filter(o => !o.observing)
      .map(o =>  {
        o.onChange(change => {
          setToPath(commit, state, [stateName, ...change.observer.path.get()], change.observer.currentDoc)
        })
        o.observe()
      }))
  }
}