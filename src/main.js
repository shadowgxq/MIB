import Vue from 'vue'
import App from './App.vue'
import router from './router'
//js
import 'plugins/element.js'
//css
import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
