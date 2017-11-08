import Vue from 'vue'
import App from './App'
import router from './router'
import { polyfillLoader } from 'polyfill-io-feature-detection'
import { polyfill } from 'es6-promise'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'

polyfill()

Vue.config.productionTip = false

Vue.prototype.$baseAPI = 'http://localhost:3000/'

let main = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

polyfillLoader({
  "features": "Promise,fetch",
  "onCompleted": main
})
