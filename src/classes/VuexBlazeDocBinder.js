import VuexBlazeDocObserver from './VuexBlazeDocObserver';

export default class VuexBlazeDocBinder {
  
  constructor(context, stateName, docRef, options) {
    this.docRef = docRef
    this.context = context
    this.stateName = stateName
    this.options = options
    this.observer = VuexBlazeDocObserver.createFromRef(docRef, [], this.options)
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