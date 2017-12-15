import Vue from 'vue'
import App from './App'
import router from './router'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import payloadcfg from '../backend/routes/config'
Vue.config.productionTip = false

// TODO: CHANGE TO LOCALHOST
Vue.prototype.$baseAPI = 'http://localhost:3000/'
Vue.prototype.$initPayload = payloadcfg.payloadInit

let main = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
