import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

import axios from 'axios'

Vue.prototype.$http=axios.create({
  baseURL:'http://localhost:5000',
  timeout: -1
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
