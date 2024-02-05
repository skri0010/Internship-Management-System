import Vue from 'vue'

import App from './App.vue'
import store from './store'
import router from './routes'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'

Vue.use(VueRouter);
Vue.config.productionTip = false
window.Event = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
