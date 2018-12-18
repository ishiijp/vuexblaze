import { once, last } from 'lodash'
import { isObject, isDocumentReference, isReference } from '../utils'

export default class VuexBlazeDocObserver {

  constructor(docRef, paths, refDepth) {
    this.docRef = docRef
    this.paths = paths
    this.refDepth = refDepth
    this.currentChange = null
    this.refObservers = {}
    this.changeCallbacks = []
    this.isFirst = true
    this.unsubscribe = null
  }

  static processDocSnapshot(snapshot, paths, refDepth, refObservers) {
    const refs = []

    const processData = (data, currentPaths) => {
      Object.entries(data).forEach(([key, value]) => {
        if (isReference(value)) {
          if (currentPaths.length < refDepth) {
            const refKey = key + '-' + value.id
            refs.push(refKey)
            if (refObservers[refKey]) {
              data[key] = refObservers[refKey].currentChange.data
            } else {
              refObservers[refKey] = isDocumentReference(value)
              ? new VuexBlazeDocObserver(value, [...currentPaths, key], refDepth)
              : new VuexBlazeCollectionObserver(value, [...currentPaths, key], refDepth)
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
    const data = processData(snapshot.data(), paths)
  
    const doc = Object.defineProperty(data, 'id', 
    {
      enumerable: false,
      writable: false,
      configurable: false,
      value: snapshot.id,
    })

    Object.keys(refObservers)
      .filter(key => !refs.includes(key))
      .forEach(key => {
        refObservers[key].unsubscribe()
        delete refObservers[key]
      })

    return { paths, data: doc }
  }

  observe() {
    return new Promise((resolve, reject) => {
      const resolveOnce = once(resolve)
      const rejectOnce = once(reject)

      this.unsubscribe = this.docRef.onSnapshot(async snapshot => {
        try {
          this.currentChange = VuexBlazeDocObserver.processDocSnapshot(snapshot, this.paths.slice(0), this.refDepth, this.refObservers)
          if (this.isFirst) {
            await Promise.all(Object.values(this.refObservers).map(child => {
              child.onChange(childChange => {
                if (this.isFirst) {
                  this.currentChange.data[last(childChange.paths)] = childChange.data
                } else {
                  this._notifyChange(childChange)
                }
              })
              return child.observe()
            }))
          } else {
            Object.values(this.refObservers).forEach(child => {
              child.onChange(childChange => {
                this._notifyChange(childChange)
              })
              child.observe()
            })
          }
          this.isFirst = false
          this._notifyChange(this.currentChange)
          resolveOnce()

        } catch(e) {
          rejectOnce(e)
        }
      }, rejectOnce)
    })
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

  _notifyChange(change) {
    this.changeCallbacks.forEach(callback => callback(change))
  }
}