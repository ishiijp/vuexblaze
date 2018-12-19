import { clearCollectionPath } from '../mutations'
import VuexBlazeCollectionObserver from './VuexBlazeCollectionObserver';

export default class VuexBlazeCollectionBinder {

  constructor(context, stateName, collectionRef, filterName, queries, options) {
    this.context = context
    this.stateName = stateName
    this.collectionRef = collectionRef
    this.filterName = filterName
    this.destructiveChangeCallbacks = []
    this.queries = queries
    this.options = options
    this.observer = new VuexBlazeCollectionObserver(
      collectionRef, this._getQueries(), [], options
    )
  }

  get collection() {
    return this.context.state[this.stateName]
  }

  async bind() {
    this.observer.onChange(async change => 
      await change.applyTo(this.context, this.stateName)  
    )
    this.observer.onDestructiveChange(() => {
      this.destructiveChangeCallbacks.forEach(callback => callback())
    })
    await this.observer.observe()
    return this
  }

  async increment() {
    await this.observer.increment()
  }

  async reload() {
    this.observer.stop()
    this.observer = new VuexBlazeCollectionObserver(
      collectionRef, this._getQueries(), [], options
    )
    clearCollectionPath(this.context.commit, this.context.state, this.stateName)
    await this.bind()
  }

  unbind() {
    this.observer.stop()
    this.destructiveChangeCallbacks = []
    this.innerCollectionInfos = []
    clearCollectionPath(this.context.commit, this.context.state, this.stateName)
  }

  onDestructiveChange(callback) {
    this.destructiveChangeCallbacks.push(callback)
  }

  _getQueries() {
    if (this.filterName && this.queries.length) {
      throw new Error('Duplicate query settings')
    }
    if (this.filterName) {
      return this.context.getters[this.filterName].map(([methodName, args]) => { 
        return Array.isArray(args) ? [methodName, args] : [methodName, [args]]
      })
    } else {
      return this.queries.slice(0)
    }
  }

}