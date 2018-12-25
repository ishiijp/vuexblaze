import { collection, doc } from 'vuexblaze'

export const state = () => ({
  allList: [],
  filteredList: [],
  isVIP: false
})

export const getters = {
  listFilter(state) {
    return [['where', ['isVIP', '==', state.isVIP]], ['limit', 3]]
  }
}

export const mutations = {
  setIsVIP: (state, value) => {
    state.isVIP = value
  }
}

export const actions = {
  ...collection('customers')
    .orderBy('firstName', 'asc')
    .bindTo('allList'),
  ...collection('customers')
    .filter(_ => {
      _.where('isVIP', '==', _.state.isVIP).limit(3)
    })
    .bindTo('filteredList')
}
