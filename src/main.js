import Vue from 'vue'
import App from './App.vue'
import About from './views/About.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'

import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.use(VueAnalytics, {
  id: 'UA-152093558-2',
  router
})
