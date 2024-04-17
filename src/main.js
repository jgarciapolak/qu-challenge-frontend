import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toasted from 'vue-toasted'

Vue.config.productionTip = false
Vue.use(Toasted)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Qu";
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
