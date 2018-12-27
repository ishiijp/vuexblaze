import { collection, doc } from 'vuexblaze'

export const state = () => ({
  customers: [],
  filteredCustomers: [],
  isVIP: false
})

export const mutations = {
  setIsVIP: (state, value) => {
    state.isVIP = value
  }
}

export const actions = {
  ...collection('customers')
    .orderBy('firstName', 'asc')
    .bind(),
  // Generate actions
  // - 'bindCustomers',
  // - 'unbindCustomers',
  // - 'reloadCustomers',
  // - 'incrementCustomers'

  ...collection('customers')
    .filter(({ query, state }) => {
      query.where('isVIP', '==', state.isVIP).limit(3)
    })
    .bindTo('filteredCustomers'),
  // Filter collection with state, getters, rootState, rootGetters
  // and generate
  // - 'bindFilteredCustomers',
  // - 'unbindFilteredCustomers',
  // - 'reloadFilteredCustomers',
  // - 'incrementFilteredCustomers'

  ...collection('customers').crud()
  // Generate CRUD actions
  // - createCustomer
  // - retrieveCustomer
  // - updateCustomer
  // - deleteCustomer
}
