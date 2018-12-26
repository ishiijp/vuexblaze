import { isObject, isReference } from '../utils'
import VuexBlazeDocObserver from './VuexBlazeDocObserver'

export default class VuexBlazeDocSnapshotProcessor {
  constructor(previousProcessor, snapshot, path, options) {
    this.previousProcessor = previousProcessor
    this.snapshot = snapshot
    this.path = path
    this.options = options

    this.refObservers = this.previousProcessor
      ? this.previousProcessor.refObservers
      : {}
    this.doc = this.previousProcessor ? this.previousProcessor.doc : null
  }

  process() {
    const refs = []
    const processData = (data, currentPath) => {
      if (!data) return null
      Object.entries(data).forEach(([key, value]) => {
        if (isReference(value)) {
          if (currentPath.isRefLimit) {
            data[key] = value.path
          } else {
            const refKey = key + '-' + value.id
            refs.push(refKey)
            if (this.refObservers[refKey]) {
              data[key] = this.refObservers[refKey].currentDoc
            } else {
              data[key] = this.doc ? this.doc[key] || undefined : undefined
              this.refObservers[refKey] = new VuexBlazeDocObserver(
                value,
                currentPath.createChild(key),
                this.options
              )
            }
          }
        } else if (isObject(value)) {
          processData(value, currentPath.createChild(key))
        } else if (Array.isArray(value)) {
          value.forEach((v, i) =>
            processData(v, currentPath.createChild([key, i]))
          )
        }
      })
      return data
    }
    const data = processData(this.snapshot.data(), this.path)

    if (data) {
      this.doc = Object.defineProperty(data, 'id', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: this.snapshot.id
      })
    }

    Object.keys(this.refObservers)
      .filter(key => !refs.includes(key))
      .forEach(key => {
        this.refObservers[key].unsubscribe()
        delete this.refObservers[key]
      })
  }

  stop() {
    Object.values(this.refObservers).forEach(o => o.stop())
  }
}
