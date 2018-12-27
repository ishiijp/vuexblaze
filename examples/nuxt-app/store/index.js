import { vuexblazePlugin, collection } from 'vuexblaze'

export const plugins = [vuexblazePlugin]

export const state = () => ({
  customers: [],
  filterType: 'all',
  incrementableCustomers: []
})

export const mutations = {
  SET_FILTER_TYPE(state, value) {
    state.filterType = value
  }
}

export const actions = {
  ...collection('customers')
    .filter(({ query, state }) => {
      if (state.filterType === 'vip') {
        query.where('isVIP', '==', true)
      } else if (state.filterType === 'normal') {
        query.where('isVIP', '==', false)
      }
    })
    .bind(),
  // Generate actions
  // - 'bindCustomers',
  // - 'unbindCustomers',
  // - 'reloadCustomers',
  // - 'incrementCustomers'

  ...collection('customers')
    .orderBy('firstName', 'asc')
    .limit(5)
    .bindTo('incrementableCustomers'),
  // Generate actions
  // - 'bindIncrementableCustomers',
  // - 'unbindIncrementableCustomers',
  // - 'reloadIncrementableCustomers',
  // - 'incrementIncrementableCustomers'

  ...collection('customers').crud()
  // Generate CRUD actions
  // - createCustomer
  // - retrieveCustomer
  // - updateCustomer
  // - deleteCustomer
}
