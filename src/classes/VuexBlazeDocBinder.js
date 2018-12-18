import VuexBlazeDocObserver from './VuexBlazeDocObserver';

export default class VuexBlazeDocBinder {
  
  constructor(context, stateName, docRef) {
    this.docRef = docRef
    this.context = context
    this.stateName = stateName
    this.observer = VuexBlazeDocObserver.createFromRef(docRef, [], 1)
  }

  async bind() {
    this.observer.onChange(async change => 
      await change.applyTo(this.context, this.stateName)
    )
    await this.observer.observe()
    return this
  }

  unbind() {
    this.observer.stop()
    this._setChange({ paths: [], data:null })
  }
}