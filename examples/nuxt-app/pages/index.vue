<template>
  <section class="container">
    <div>
      <h2>All Customers (Alphabetical order)</h2>
      <button @click="add">ADD CUSTOMER</button>
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
      <h2>Filtered Customers (Limited 3 lines)</h2>
      <template v-if="isVIP">
        <span>Showing only VIP</span>
        <a href="#" @click.prevent="setIsVIP(false)">Show Normal Customers</a>
      </template>
      <template v-if="!isVIP">
        <span>Showing only Normal</span>
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
        <li>
          <a href="#" @click="incrementFilteredCustomers">Show more</a>
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
      allCustomers: 'customers',
      filteredCustomers: 'filteredCustomers',
      isVIP: 'isVIP'
    })
  },
  async mounted() {
    this.$store.dispatch('customers/bindCustomers')
    this.$store.dispatch('customers/bindFilteredCustomers')
  },
  methods: {
    add() {
      this.$store.dispatch('customers/createCustomer', {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        isVIP: false
      })
    },
    setIsVIP(value) {
      this.$store.commit('customers/setIsVIP', value)
      this.$store.dispatch('customers/reloadFilteredCustomers')
    },
    toVIP(customer) {
      this.$store.dispatch('customers/updateCustomer', [
        customer.id,
        { isVIP: true }
      ])
    },
    toNormal(customer) {
      this.$store.dispatch('customers/updateCustomer', [
        customer.id,
        { isVIP: false }
      ])
    },
    incrementFilteredCustomers() {
      this.$store.dispatch('customers/incrementFilteredCustomers')
    }
  }
}
</script>