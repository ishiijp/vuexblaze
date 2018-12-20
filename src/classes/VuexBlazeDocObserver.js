import { once } from 'lodash'
import VuexBlazeDocChange from './VuexBlazeDocChange';
import VuexBlazeDocSnapshotProcessor from './VuexBlazeDocSnapshotProcessor';

export default class VuexBlazeDocObserver {

  constructor(docRef, path, options) {
    this.docRef = docRef
    this.path = path
    this.options = options

    this.changeCallbacks = []
    this.snapshotProcessor = null
    self.unsubscribe = null
  }

  get observing() {
    return !!this.snapshotProcessor 
  }

  get childObservers() {
    return this.snapshotProcessor ? Object.values(this.snapshotProcessor.refObservers) : []
  }

  get currentDoc() {
    return this.snapshotProcessor ? this.snapshotProcessor.doc : null
  }

  async observe() {
    return new Promise((resolve, reject) => {
      const resolveOnce = once(resolve)
      const rejectOnce = once(reject)
      this.unsubscribe = this.docRef.onSnapshot(async snapshot => {
        try {
          this.snapshotProcessor = new VuexBlazeDocSnapshotProcessor(this.snapshotProcessor, snapshot, this.path, this.options)
          this.snapshotProcessor.process()
          await this.notifyChange(new VuexBlazeDocChange(this))
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
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.snapshotProcessor) {
      this.snapshotProcessor.stop()
    }
    this.snapshotProcessor = null
  }

  async notifyChange(change) {
    await Promise.all(this.changeCallbacks.map(callback => callback(change)))
  }
}