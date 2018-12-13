import {
  VUEXBLAZE_SET_VALUE,
  VUEXBLAZE_COLLECTION_ADD,
  VUEXBLAZE_COLLECTION_REMOVE,
  VUEXBLAZE_COLLECTION_SPLICE
} from './types'

import { once, last } from 'lodash'

const noop = () => {}

class VuexBlazeCollection {

  constructor(collectionName) {
    this.collectionName = collectionName
    this.specifiedQueries = []
    this.innerCollections = []

    this.$firestore = null
    this.commit = null
    this.state = null
    this.stateName = null
    this.filterStateName = null
    this.destructiveChangeCallbacks = []
    
    this.FIRESTORE_METHODS.forEach(methodName => {
      this[methodName] = (...args) => {
        this.specifiedQueries.push([methodName, args])
        return this
      }
    })
  }

  get isBinded() {
    return !!this.innerCollections.length
  }

  bindTo(stateName) { 
    const self = this

    return {
      async [actionName('bind', stateName)]({ commit, state, getters }) {
        if (self.isBinded) {
          throw new Error('Already binded!')
        }
        if (self.filterStateName && self.specifiedQueries.length) {
          throw new Error('Duplicate query settings')
        }
        self.state = state
        self.commit = commit
        self.stateName = stateName
        self.getters = getters
        self.$firestore = this.$firestore || this.$fireStore
        return self.load()
      },
      async [actionName('reload', stateName)]() {
        self.clear()
        return self.load()
      },
      async [actionName('unbind', stateName)]() {
        self.clear()
      },
      async [actionName('increment', stateName)]() {
        if (!self.isBinded) {
          throw new Error('Please bind first!')
        }
        const info = last(self.innerCollections).createNext()
        return info.processCollection(self)
      }
    }
  }

  load() {
    let queries = []
    if (this.filterStateName) {
      this.getters[this.filterStateName].forEach(([methodName, args]) => { 
        if (Array.isArray(args)) {
          queries.push([methodName, args])
        } else {
          queries.push([methodName, [args]])
        }
      })
    } else {
      queries = this.specifiedQueries.slice(0)
    }
    
    const info = VuexBlazeInnerCollection.create({
      all: this.innerCollections,
      $firestore: this.$firestore,
      collectionName: this.collectionName,
      commit: this.commit,
      state: this.state, 
      stateName: this.stateName,
      queries
    })
    return info.processCollection(this)
  }

  filterBy(filterStateName) {
    this.filterStateName = filterStateName
    return this
  }

  clear() {
    this.innerCollections.forEach(info => info.unsubscribe())
    this.innerCollections = []
    this.commit(
      VUEXBLAZE_SET_VALUE, 
      { target: this.state, name: this.stateName, data: [] }, 
      {root : true}
    )
    return this
  }

  onDestructiveChange(callback) {
    this.destructiveChangeCallbacks.push(callback)
  }

  _isArrayOfArray(value) {
    if (Array.isArray(value) && value.length) {
      return Array.isArray(value[0])
    }
  }
}

class VuexBlazeInnerCollection {
  constructor() {
    this.length = 0
    this.lastDoc = null
    this.unsubscribe = noop
    this.collection = []
  }

  static create(args) {
    const obj = new VuexBlazeInnerCollection()
    ;['all', '$firestore', 'collectionName', 'commit', 'state', 'stateName', 'queries'].forEach(name => {
      obj[name] = args[name]
    })
    obj.all.push(obj)
    return obj
  }

  get index() {
    return this.all.indexOf(this)
  }

  get startIndex() {
    return this.all.slice(0, this.index).reduce((sum, info) => {
      return sum + info.length
    }, 0)
  }

  createNext() {
    const nextInfo = new VuexBlazeInnerCollection()
    ;['all', '$firestore', 'collectionName', 'commit', 'state', 'stateName'].forEach(name => {
      nextInfo[name] = this[name]
    })
    nextInfo.queries = this.queries.slice(0).filter(
      ([query, args]) => ['orderBy', 'limit', 'where'].includes(query)
    )
    nextInfo.queries.push(['startAfter', [this.lastDoc]])
    this.all.push(nextInfo)
    return nextInfo
  }

  createCollectionRef() {
    let collectionRef = this.$firestore.collection(this.collectionName)
    this.queries.forEach(([query, args]) => {
      collectionRef = collectionRef[query](...args)
    })
    return collectionRef
  }

  processCollection(parent) {
    const collectionRef = this.createCollectionRef()

    return new Promise((resolve, reject) => {
      let isFirst = true
      let changes = []

      this.unsubscribe = collectionRef.onSnapshot({includeMetadataChanges: true}, 
        querySnapshot => {

          changes = changes.concat(querySnapshot.docChanges())

          if (querySnapshot.metadata.fromCache) return

          if (isFirst) {
            if (!changes.length) {
              this.all.splice(this.index, 1)
              this.unsubscribe()
            } else {
              this.processQuerySnapshot(querySnapshot, changes)
              isFirst = false
              changes = []
            }

            resolve(parent)
          } else {
            const { added, removed } = changes.reduce((result, change) => {
                switch(change.type) {
                  case 'added': result.added = true; break
                  case 'removed': result.removed = true; break
                }
                return result
              }, { added: false, removed: false})

            if (added && removed) {
              parent.destructiveChangeCallbacks.forEach(callback => callback())
            } else {
              this.processQuerySnapshot(querySnapshot, changes)
              changes = []
            }
          }

        }, reject)
    })
  }

  processQuerySnapshot(querySnapshot, changes) {
    changes.forEach(change => {
      switch(change.type) {
        case 'added': 
          this.collection.splice(change.newIndex, 0, snapshotToData(change.doc))
          return
        case 'removed': 
          this.collection.splice(change.oldIndex, 1)
          return
        case 'modified': 
          this.collection.splice(change.oldIndex, 1)
          this.collection.splice(change.newIndex, 0, snapshotToData(change.doc))
          return
      }
    })
    this._commitSplice(this.startIndex, this.length, ...this.collection)
    this.length = querySnapshot.size
    this.firstDoc = querySnapshot.docs[0]
    this.lastDoc = last(querySnapshot.docs)
  }

  _commitSplice(index, howMany, ...elements) {
    this.commit(
      VUEXBLAZE_COLLECTION_SPLICE,
      {
        target: this.state[this.stateName], 
        index,
        howMany,
        elements
      },
      { root: true }
    )
  }
}

VuexBlazeCollection.prototype.FIRESTORE_METHODS = ['where', 'orderBy', 'startAt', 'startAfter', 'endAt', 'limit']

class VuexBlazeDoc {

  constructor(collectionName) {
    this.collectionName = collectionName
    this.unsubscribe = null
  }



  bindTo(stateName) {
    const self = this

    return {
      async [actionName('bind', stateName)]({ commit, state }, payload) {
        self._clear(commit, state, stateName)
        const { $firestore } = this
        const docRef = $firestore.collection(self.collectionName).doc(payload)
        const setValue = data => commit(
          VUEXBLAZE_SET_VALUE, 
          { target: state, name: stateName, data}, 
          { root: true }
        )
        return new Promise((resolve, reject) => {
          const resolveOnce = once(resolve)
          self.unsubscribe = docRef.onSnapshot(snapshot => {
            if (snapshot.exists) {
              setValue(snapshotToData(snapshot))
            } else {
              setValue(null)
            }
            resolveOnce()
          }, reject)
        })
      },
      async [actionName('unbind', stateName)]({ commit, state }) {
        self.clear(commit, state, stateName)
      }
    }
  }

  clear(commit, state, stateName) {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    commit(
      VUEXBLAZE_SET_VALUE, 
      { target: state, name: stateName, data: null }, 
      { root: true}
    )
  }
}

function actionName(type, stateName) {
  switch(type) {
    case 'bind': return `BIND_${stateName.toUpperCase()}`
    case 'unbind': return `UNBIND_${stateName.toUpperCase()}`
    case 'increment': return `INCREMENT_${stateName.toUpperCase()}`
    case 'reload': return `RELOAD_${stateName.toUpperCase()}`
  }
}

function snapshotToData(snapshot) {
  const data = snapshot.data()
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
    value: snapshot.id,
  })
}

function collection(collectionName) {
  return new VuexBlazeCollection(collectionName)
}

function doc(collectionName) {
  return new VuexBlazeDoc(collectionName)
}

const vuexblazeMutations = {
  [VUEXBLAZE_SET_VALUE] (state, { target, name, data }) {
    target[name] = data
  },
  [VUEXBLAZE_COLLECTION_ADD] (state, { newIndex, data, target }) {
    target.splice(newIndex, 0, data)
  },
  [VUEXBLAZE_COLLECTION_REMOVE] (state, { oldIndex, target }) {
    return target.splice(oldIndex, 1)[0]
  },
  [VUEXBLAZE_COLLECTION_SPLICE] (state, { target, index, howMany, elements } ) {
    return target.splice(index, howMany, ...elements)
  }
}

export {
  collection,
  doc,
  vuexblazeMutations
}

