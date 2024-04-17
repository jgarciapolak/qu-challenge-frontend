import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddJoke from '../views/AddJoke.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: "Qu - Jokes" },
    component: Home,
  },
  {
    path: '/add',
    name: 'AddJoke',
    meta: { title: "Qu - Add a joke" },
    component: AddJoke,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
