import Vue from 'vue'
import App from './App'
import router from './router'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

Vue.prototype.$baseAPI = 'http://localhost:3000/'

let main = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
