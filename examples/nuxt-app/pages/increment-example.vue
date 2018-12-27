<template>
  <div class="increment-example">
    <nuxt-link to="/">Back to home</nuxt-link>
    <div class="btns">
      <button class="btn" @click="addCustomer()">Add Customer</button>
    </div>
    <table class="customers">
      <tr v-for="customer in customers" :key="customer.id">
        <td>{{customer.firstName}} {{ customer.lastName}}</td>
        <td>
          <span v-if="customer.isVIP">VIP</span>
          <span v-if="!customer.isVIP">Normal</span>
        </td>
      </tr>
    </table>
    <a class="link" href="#" @click.prevent="increment">Show more</a>
    <a class="link" href="#" @click.prevent="reload">Reload</a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import faker from 'faker'

export default {
  computed: {
    ...mapState({
      customers: 'incrementableCustomers'
    })
  },
  mounted() {
    this.$store.dispatch('bindIncrementableCustomers')
  },
  methods: {
    addCustomer() {
      this.$store.dispatch('createCustomer', {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        isVIP: false
      })
    },
    increment() {
      this.$store.dispatch('incrementIncrementableCustomers')
    },
    reload() {
      this.$store.dispatch('reloadIncrementableCustomers')
    }
  }
}
</script>

<style lang="scss">
.btns {
  padding: 30px 0 10px;
}
.link {
  padding: 0 10px;
}
</style>