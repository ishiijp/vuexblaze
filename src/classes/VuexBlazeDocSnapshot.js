export default class VuexBlazeDocSnapshot {

  constructor($firestore, snapshot, refDepth) {
    this.$firestore = $firestore
    this.snapshot = snapshot
    this.refDepth = refDepth
  }

  async fetch() {
    const data = this.snapshot.data()
    const isObject = o => o && typeof o === 'object'
    const isRef = o => o && o.onSnapshot
  
    const processRefs = data => {
      Object.entries(data).forEach(([key, value]) => {
        if (isRef(value)) {
          data[key] = value.path
        } else if (isObject(value)) {
          processRefs(value)
        } else if (Array.isArray(value)) {
          value.forEach(processRefs)
        }
      })
    }
    processRefs(data)
  
    return Object.defineProperty(data, 'id', 
    {
      enumerable: false,
      writable: false,
      configurable: false,
      value: this.snapshot.id,
    })
  }
}