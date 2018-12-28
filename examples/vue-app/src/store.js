import Vue from 'vue'
import Vuex from 'vuex'
import { vuexblazePlugin, collection } from 'vuexblaze'
import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIRE_API_KEY,
  databaseURL: process.env.VUE_APP_FIRE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIRE_PROJECT_ID
})

const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexblazePlugin.config({ firestore })],
  state: {
    customers: [],
    filterType: 'all',
    incrementableCustomers: []
  },
  mutations: {
    SET_FILTER_TYPE(state, value) {
      state.filterType = value
    }
  },
  actions: {
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
})
