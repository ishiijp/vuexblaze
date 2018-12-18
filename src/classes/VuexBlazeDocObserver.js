import { once } from 'lodash'
import { isObject, isDocumentReference, isReference } from '../utils'
import VuexBlazeDocChange from './VuexBlazeDocChange';

export default class VuexBlazeDocObserver {

  constructor(paths, refDepth) {
    this.paths = paths
    this.refDepth = refDepth
    this.currentDoc = null
    this.refObservers = {}
    this.changeCallbacks = []
    this.observing = false
  }

  static createFromRef(docRef, paths, refDepth) {
    const self = new VuexBlazeDocObserver(paths, refDepth)
    self.docRef = docRef
    self.unsubscribe = null
    return self
  }

  static createFromSnapshot(snapshot, paths, refDepth, previousObserver) {
    const self = new VuexBlazeDocObserver(paths, refDepth)
    self.snapshot = snapshot
    if (previousObserver) {
      self.refObservers = previousObserver.refObservers
    }
    return self
  }

  get childObservers() {
    return Object.values(this.refObservers)
  }

  async observe() {
    this.observing = true
    if (this.docRef) {
      return new Promise((resolve, reject) => {
        const resolveOnce = once(resolve)
        const rejectOnce = once(reject)
        this.unsubscribe = this.docRef.onSnapshot(async snapshot => {
          try {
            this.currentDoc = this._processDocSnapshot(snapshot)
            await this.notifyChange()
            resolveOnce()
          } catch(e) {
            rejectOnce(e)
          }
        }, rejectOnce)
      })
    } else if (this.snapshot) {
      this.currentDoc = this._processDocSnapshot(snapshot)
      await this.notifyChange()
    } else {
      throw new Error('Unexpected Initialization')
    }
  }

  onChange(callback) {
    this.changeCallbacks.push(callback)
  }

  stop() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    Object.values(this.refObservers).forEach(child => {
      child.stop()
    })
    this.currentDoc = null
    this.refObservers = {}
    this.observing = false
  }

  _processDocSnapshot(snapshot) {
    const refs = []

    const processData = (data, currentPaths) => {
      Object.entries(data).forEach(([key, value]) => {
        if (isReference(value)) {
          if (currentPaths.length < this.refDepth) {
            const refKey = key + '-' + value.id
            refs.push(refKey)
            if (this.refObservers[refKey]) {
              data[key] = this.refObservers[refKey].currentDoc
            } else {
              data[key] = this.currentDoc ? this.currentDoc[key] || undefined : undefined
              this.refObservers[refKey] = isDocumentReference(value)
                ? VuexBlazeDocObserver.createFromRef(value, [...currentPaths, key], this.refDepth)
                : new VuexBlazeCollectionObserver(value, [...currentPaths, key], this.refDepth)
            }
          } else {
            data[key] = value.path
          }
        } else if (isObject(value)) {
          processData(value, [...currentPaths, key])
        } else if (Array.isArray(value)) {
          value.forEach((v, i) => processData(v, [...currentPaths, key, i]))
        }
      })
      return data
    }
    const data = processData(snapshot.data(), this.paths)
  
    const doc = Object.defineProperty(data, 'id', 
    {
      enumerable: false,
      writable: false,
      configurable: false,
      value: snapshot.id,
    })

    Object.keys(this.refObservers)
      .filter(key => !refs.includes(key))
      .forEach(key => {
        this.refObservers[key].unsubscribe()
        delete this.refObservers[key]
      })

    return doc
  }

  async notifyChange() {
    await Promise.all(this.changeCallbacks.map(callback => callback(new VuexBlazeDocChange(this))))
  }
}