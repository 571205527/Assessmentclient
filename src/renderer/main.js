import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios;
axios.defaults.baseURL =`http://localhost:8087`;//本地//`http://118.25.65.152:8086`;//线上//`http://118.25.65.152:8085`;//`http://118.25.65.152:8080`//线上;

import App from './App'
import router from './router'
//双语
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('lg')||'zh', //语言标识
  messages:{
    'zh':require('./assets/language/zh.js'),
    'en':require('./assets/language/en.js')
  }
})
//UI
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI,{size:'large'});


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  i18n,
  template: '<App/>',
  methods:{
    handleScroll: function (evt, el) {
      console.log(window.scrollY)
      if (window.scrollY > 50) {
        TweenMax.to(el, 1.5, {
          y: -10,
          opacity: 1,
          ease: Sine.easeOut
        })
      }
      return window.scrollY > 100
    }
  }
}).$mount('#app')