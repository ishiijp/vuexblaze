import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import BasicExample from './views/BasicExample.vue'
import IncrementExample from './views/IncrementExample.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/basic-example',
      name: 'basic-example',
      component: BasicExample
    },
    {
      path: '/increment-example',
      name: 'increment-example',
      component: IncrementExample
    }
  ]
})
