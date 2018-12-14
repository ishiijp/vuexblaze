import { collection, doc } from 'vuexblaze'

export const state = () => ({
  allList: [],
  filteredList: [],
  isVIP: true
})

export const getters = {
  listFilter(state) {
    return [
      ['where', ['isVIP', '==', state.isVIP]],
      ['limit', 3]
    ]
  }
}

export const mutations = {
  SET_IS_VIP: (state, value) => {
    state.isVIP = value
  }
}

export const actions = {
  ...collection('customers').orderBy('firstName').bindTo('allList'),
  ...collection('customers').filterBy('listFilter').bindTo('filteredList')
}
