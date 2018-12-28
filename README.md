# VuexBlaze

Not fire but blaze🔥🔥🔥

## Examples

- [Vue Example](https://github.com/ishiijp/vuexblaze/tree/master/examples/vue-app)
- [Nuxt Example](https://github.com/ishiijp/vuexblaze/tree/master/examples/nuxt-app)

## Installation

```bash
yarn add vuexblaze
```

or

```bash
npm install --save vuexblaze
```

## Quickstart

### Setup Firestore and add _vuexblazePlugin_ to _Vuex.Store_

#### For Vue users

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { vuexblazePlugin, collection } from 'vuexblaze'
import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: [YOUR FIREBASE KEY],
  databaseURL: [YOUR FIREBASE DATABASE URL],
  projectId: [YOUR PROJECT ID]
})

const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexblazePlugin.config({ firestore })],
  // ...
})
```

#### For Nuxt users

Set up Firestore using [Nuxt-Fire](https://github.com/lupas/nuxt-fire), and add plugin.

```js
import { vuexblazePlugin, collection } from 'vuexblaze'
export const plugins = [vuexblazePlugin]
```

Note that you don't have to pass firestore instance to _vuexblazePlugin_ .

### Generate actions and call them

#### Collection binding

```js
import { vuexblazePlugin, collection } from 'vuexblaze'

export default new Vuex.Store({
  plugins: [vuexblazePlugin],
  state: {
    customers: []
  },
  actions: {
    ...collection('customers')
      .orderBy('name')
      .limit(10)
      .bind()
  }
})
```

This will generate 4 actions.

- bindCustomers
- unbindCustomers
- reloadCustomers
- incrementCustomers

#### Document binding

```js
  state: {
    targetCustomer: null
  }
  actions: {
    ...collection('customers').doc().bindTo('targetCustomer')
  }
```

This will generate 2 actions

- bindTargetCustomer
- unbindTargetCustomer

#### CRUD

```js
  actions: {
    ...collection('customers').crud()
  }
```

This will generate 4 actions.

- createCustomer
- retrieveCustomer
- updateCustomer
- deleteCustomer

### Call actions

```html
<template>
  <ul>
    <li v-for="customer in customers" :key="customer.id">{{customer.name}}</li>
  </ul>
  .....
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState(['customers'])
    },
    mounted() {
      this.$store.dispatch('bindCustomers')
    },
    methods() {
      createCustomer() {
        this.$store.dispatch('createCustomer', {
          name: 'Blaze Foley',
          isVIP: false
        })
      },
      deleteCustomer(customerId) {
        this.$store.dispatch('deleteCustomer', customerId)
      },
      changeToVIP(customerId) {
        this.$store.dispatch('updateCustomer', [
          customerId,
          { isVIP: true }
        ])
      }
    }
  }
</script>
```

## More usage

### Filter collections with states and getters

```js
  actions: {
    ...collection('customers')
      .filter(({ query, state, rootState, getters, rootGetters }) => {
        query
          .where('isVIP', '==', state.customerType == 'vip')
          .orderBy('name', 'asc')
          .limit(state.limit)
      })
      .bind()
  }
```

You can reload the customers using a generated action "_reloadCustomers_".

```js
  methods: {
    changeCustomerType(type) {
      this.$store.commit('SET_CUSTOMER_TYPE', type)
      this.$store.dispatch('reloadCustomers')
    }
  }
```

## License

[MIT](http://opensource.org/licenses/MIT)
