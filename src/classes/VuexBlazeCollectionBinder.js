import { clearCollectionPath } from '../mutations'
import { VUEXBLAZE_STOP_ON_UNCONTROLLABLE_CHANGE } from '../options'
import VuexBlazeCollectionObserver from './VuexBlazeCollectionObserver'
import VuexBlazePath from './VuexBlazePath'
import Queue from 'promise-queue'

export default class VuexBlazeCollectionBinder {

  constructor(context, stateName, collectionRef, filterName, queries, options) {
    this.context = context
    this.stateName = stateName
    this.collectionRef = collectionRef
    this.filterName = filterName
    this.uncontrollableChangeCallbacks = []
    this.queries = queries
    this.options = options
    this.observer = null
    this.queue = new Queue(1, 1)
  }

  get binded() {
    return !!this.observer
  }

  bind() {
    return new Promise((resolve, reject) => {
      this.queue.add(async () => {
        if (this.binded) return reject('Already binded')
        clearCollectionPath(this.context.commit, this.context.state, this.stateName)  
        this.observer = new VuexBlazeCollectionObserver(
          this.collectionRef, this._getQueries(), VuexBlazePath.createRoot(this.options), this.options
        )
        this.observer.onChange(async change => 
          await change.applyTo(this.context, this.stateName)  
        )
        this.observer.onUncontrollableChange(() => {
          if (this.options.onUncontrollableChange == VUEXBLAZE_STOP_ON_UNCONTROLLABLE_CHANGE) {
            this.observer.stop()
          }
          this.uncontrollableChangeCallbacks.forEach(callback => callback())
        })
        await this.observer.observe()
        resolve(this)
      })
    })
  }

  increment() {
    return new Promise((resolve, reject) => {
      this.queue.add(async () => {
        if (!this.binded) return reject('Not binded')
        console.log(this.binded)
        await this.observer.increment()
        resolve(this)
      })
    })
  }

  reload() {
    return new Promise((resolve, reject) => {
      this.queue.add(async () => {
        if (!this.binded) return reject('Not binded')
        this.observer.stop()
        clearCollectionPath(this.context.commit, this.context.state, this.stateName)  
        
        const observer = new VuexBlazeCollectionObserver(
          this.collectionRef, this._getQueries(), VuexBlazePath.createRoot(this.options), this.options
        )
        observer.changeCallbacks = this.observer.changeCallbacks
        observer.uncontrollableChangeCallbacks = this.observer.uncontrollableChangeCallbacks

        this.observer = observer
        await this.observer.observe()
        resolve(this)
      })
    })
  }

  unbind() {
    this.queue.add(async () => {
      if (this.observer) {
        this.observer.stop()
        this.observer = null
      }
      this.uncontrollableChangeCallbacks = []
      this.innerCollectionInfos = []
      clearCollectionPath(this.context.commit, this.context.state, this.stateName)
    })
  }

  onUncontrollableChange(callback) {
    this.uncontrollableChangeCallbacks.push(callback)
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