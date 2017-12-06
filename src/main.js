import Vue from 'vue'
import App from './App'
import router from './router'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
let [initPayload] = require('../backend/routes/payloadConfig')
Vue.config.productionTip = false

Vue.prototype.$baseAPI = 'http://localhost:3000/'
Vue.prototype.$initPayload = initPayload

let main = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
