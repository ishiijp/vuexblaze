<template>
  <div class="basic-example">
    <nuxt-link to="/">Back to home</nuxt-link>
    <div class="filter">
      Filter:
      <select @change="setFilterType($event.target.value)">
        <option value="all">All</option>
        <option value="normal">Normal</option>
        <option value="vip">VIP</option>
      </select>
    </div>
    <button class="btn" @click="addCustomer(1)">Add Customer</button>
    <button class="btn" @click="addCustomer(10)">Add Customer +10</button>
    <table class="customers">
      <tr v-for="customer in customers" :key="customer.id">
        <td>{{customer.firstName}} {{ customer.lastName}}</td>
        <td>
          <span v-if="customer.isVIP">VIP</span>
          <span v-if="!customer.isVIP">Normal</span>
        </td>
        <td>
          <a v-if="!customer.isVIP" href="#" @click.prevent="changeToVIP(customer.id)">to VIP</a>
          <a v-if="customer.isVIP" href="#" @click.prevent="changeToNormal(customer.id)">to Normal</a>
        </td>
        <td>
          <a href="#" @click="deleteCustomer(customer.id)">Delete</a>
        </td>
      </tr>
    </table>
    <div v-if="!customers.length && !loading">No customers</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import faker from 'faker'

export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState(['customers'])
  },
  mounted() {
    this.waitLoading(async () => {
      await this.$store.dispatch('bindCustomers')
    })
  },
  methods: {
    setFilterType(type) {
      this.waitLoading(async () => {
        this.$store.commit('SET_FILTER_TYPE', type)
        await this.$store.dispatch('reloadCustomers')
      })
    },
    addCustomer(num) {
      Array.from(Array(num).keys()).forEach(() => {
        this.$store.dispatch('createCustomer', {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          isVIP: false
        })
      })
    },
    changeToVIP(id) {
      this.$store.dispatch('updateCustomer', [id, { isVIP: true }])
    },
    changeToNormal(id) {
      this.$store.dispatch('updateCustomer', [id, { isVIP: false }])
    },
    deleteCustomer(id) {
      this.$store.dispatch('deleteCustomer', id)
    },
    async waitLoading(process) {
      this.loading = true
      await process()
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  padding: 30px;
}

.btn {
  margin: 0 5px;
}

.customers {
  margin: 40px auto;
  tr > td {
    padding: 3px 10px;
  }
}
</style>
