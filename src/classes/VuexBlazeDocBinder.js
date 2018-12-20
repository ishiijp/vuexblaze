import { clearCollectionPath } from '../mutations'
import VuexBlazeDocObserver from './VuexBlazeDocObserver';
import VuexBlazePath from './VuexBlazePath';

export default class VuexBlazeDocBinder {
  
  constructor(context, stateName, docRef, options) {
    this.docRef = docRef
    this.context = context
    this.stateName = stateName
    this.options = options
  }

  async bind() {
    this.observer = new VuexBlazeDocObserver(this.docRef, VuexBlazePath.createRoot(this.options), this.options)
    this.observer.onChange(async change => 
      await change.applyTo(this.context, this.stateName)
    )
    await this.observer.observe()
    return this
  }

  unbind() {
    this.observer.stop()
    clearCollectionPath(this.context.commit, this.context.state, this.stateName)
  }
}