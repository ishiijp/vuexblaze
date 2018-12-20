import { clearCollectionPath } from '../mutations'
import VuexBlazeCollectionObserver from './VuexBlazeCollectionObserver'
import VuexBlazePath from './VuexBlazePath'
import Queue from 'promise-queue'

export default class VuexBlazeCollectionBinder {

  constructor(context, stateName, collectionRef, filterName, queries, options) {
    this.context = context
    this.stateName = stateName
    this.collectionRef = collectionRef
    this.filterName = filterName
    this.destructiveChangeCallbacks = []
    this.queries = queries
    this.options = options

    this.queue = new Queue(1, 1)
  }

  bind() {
    return new Promise((resolve, reject) => {
      this.queue.add(async () => {

        this.observer = new VuexBlazeCollectionObserver(
          this.collectionRef, this._getQueries(), VuexBlazePath.createRoot(this.options), this.options
        )
        this.observer.onChange(async change => 
          await change.applyTo(this.context, this.stateName)  
        )
        this.observer.onDestructiveChange(() => {
          this.destructiveChangeCallbacks.forEach(callback => callback())
        })
        await this.observer.observe()
        resolve(this)
      })
    })
  }

  increment() {
    return new Promise((resolve, reject) => {
      this.queue.add(async () => {
        if (!this.observer) reject('Not binded')
        await this.observer.increment()
        resolve(this)
      })
    })
  }

  reload() {
    return new Promise((resolve, reject) => {
      this.queue.add(async () => {
        this.observer.stop()
        clearCollectionPath(this.context.commit, this.context.state, this.stateName)  
        
        const observer = new VuexBlazeCollectionObserver(
          this.collectionRef, this._getQueries(), VuexBlazePath.createRoot(this.options), this.options
        )
        observer.changeCallbacks = this.observer.changeCallbacks
        observer.destructiveChangeCallbacks = this.observer.destructiveChangeCallbacks

        this.observer = observer
        await this.observer.observe()
        resolve(this)
      })
    })
  }

  unbind() {
    this.queue.add(async () => {
      this.observer.stop()
      this.destructiveChangeCallbacks = []
      this.innerCollectionInfos = []
      clearCollectionPath(this.context.commit, this.context.state, this.stateName)
    })
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