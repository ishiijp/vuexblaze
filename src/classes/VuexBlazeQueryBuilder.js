export default class VuexBlazeQueryBuilder {
  constructor(builder) {
    this._builder = builder
    this._queries = []
  }

  static createFromProxy(proxy) {
    const self = new VuexBlazeQueryBuilder()
    self.FIRESTORE_METHODS.forEach(methodName => {
      proxy[methodName] = (...args) => {
        self._queries.push([methodName, args])
        return proxy
      }
    })
    return self
  }

  _getBuilder() {
    if (this._builder) return this._builder

    return context => {
      this._queries.forEach(([methodName, args]) => {
        context[methodName](...args)
      })
    }
  }

  build(collectionRef, storeContext) {
    const createContext = asIncrementedQuery => {
      const context = this.FIRESTORE_METHODS.reduce(
        (context, method) => {
          if (
            asIncrementedQuery &&
            !['where', 'orderBy', 'limit'].includes(method)
          ) {
            return context
          }
          context[method] = (...args) => {
            context.collectionRef = context.collectionRef[method](...args)
            return context
          }
          return context
        },
        {
          ...storeContext,
          collectionRef,
          $firestore: storeContext.rootGetters['vuexblaze/$firestore']
        }
      )
      context.query = context
      return context
    }

    const primaryQueryContext = createContext(false)
    const incrementedQueryContext = createContext(true)

    const builder = this._getBuilder()

    builder(primaryQueryContext)
    builder(incrementedQueryContext)
    return {
      primary: primaryQueryContext.collectionRef,
      incremented: incrementedQueryContext.collectionRef
    }
  }
}

VuexBlazeQueryBuilder.prototype.FIRESTORE_METHODS = [
  'where',
  'orderBy',
  'startAt',
  'startAfter',
  'endAt',
  'endBefore',
  'limit'
]
