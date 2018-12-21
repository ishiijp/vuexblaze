<template>
  <section class="container">
    <h1 class="title">Customers</h1>
    <button @click="add">ADD CUSTOMER</button>

    <div>
      <h2>All Customers (Alphabetical order)</h2>
      <ul>
        <li v-for="(customer, index) in allCustomers" :key="index">
          {{customer.firstName}} {{customer.lastName}} 
          <span v-if="customer.isVIP">
            <b>[VIP]</b>
            <a href="#" @click="toNormal(customer)">Change to Normal</a>
          </span>
          <span v-if="!customer.isVIP">
            [Normal]
            <a href="#" @click="toVIP(customer)">Change to VIP</a>
          </span>
        </li>
      </ul>
    </div>

    <div>
      <template v-if="isVIP">
        <h2 >VIP Customers</h2>
        <a href="#" @click.prevent="setIsVIP(false)">Show Normal Customers</a>
      </template>
      <template v-if="!isVIP">
        <h2>Normal Customers</h2>
        <a href="#" @click.prevent="setIsVIP(true)">Show VIP Customers</a>
      </template>
      <ul>
        <li v-for="(customer, index) in filteredCustomers" :key="index">
          {{customer.firstName}} {{customer.lastName}} 
          <span v-if="customer.isVIP">
            <b>[VIP]</b>
            <a href="#" @click="toNormal(customer)">change to Normal</a>
          </span>
          <span v-if="!customer.isVIP">
            [Normal]
            <a href="#" @click="toVIP(customer)">change to VIP</a>
          </span>
        </li>
      </ul>

    </div>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import faker from 'faker'

export default {
  computed: {
    ...mapState('customers', {
      allCustomers: 'allList',
      filteredCustomers: 'filteredList',
      isVIP: 'isVIP'
    })
  },
  async mounted() {
    this.$store.dispatch('customers/bindAllList')
    this.$store.dispatch('customers/bindFilteredList')
  },
  methods: { 
    add() {
      this.$fireStore.collection('customers').add({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        isVIP: false
      })
    },
    setIsVIP(value) {
      this.$store.commit('customers/setIsVIP', value)
      this.$store.dispatch('customers/reloadFilteredList')
    },
    toVIP(customer) {
      this.$fireStore.collection('customers').doc(customer.id).set({
        isVIP: true
      }, { merge: true})
    },
    toNormal(customer) {
      this.$fireStore.collection('customers').doc(customer.id).set({
        isVIP: false
      }, { merge: true})
    },
  }
}

</script>