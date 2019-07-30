// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './App'
import router from './router'
import User from './classes/User'
import axios from 'axios'
import {isEmpty} from './classes/mainFunctions'

Vue.config.productionTip = false
Vue.use(VueCookies)
VueCookies.config('7d')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: () => {
    const obj = {
      axios: axios,
      api: {
        url: 'http://localhost',
        port: 8080
      },
      alerts: [],
      prompts: [],
      confirms: [],
      user: new User(),
      menu: [
        {
          url: '/',
          name: 'Inicio'
        },
        {
          url: '/about',
          name: 'Acerca de nosotros'
        },
        {
          url: '/contact',
          name: 'Contactanos'
        }
      ]
    }

    return obj
  },
  methods: {
    alert: function (options) {
      this.blur()
      this.alerts.push(options)
    },
    removeFromAlert: function (idx) {
      this.alerts.splice(idx, 1)
    },
    confirm: function (options) {
      this.blur()
      this.alerts.push(options)
    },
    removeFromConfirm: function (idx) {
      this.confirms.splice(idx, 1)
    },
    prompt: function (options) {
      this.blur()
      if (isNaN(options.maxlength)) {
        options.maxlength = null
      }
      if (isEmpty(options.placeholder)) {
        options.placeholder = null
      }
      this.alerts.push(options)
    },
    removeFromPrompts: function (idx) {
      this.prompts.splice(idx, 1)
    }
  },
  computed: {
    apiRoute: function () {
      return `${this.api.url}:${this.api.port}/api`
    }
  },
  router,
  components: {App},
  template: '<App/>',
  created: function () {
    this.axios = this.axios.create({
      baseURL: this.apiRoute,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  mounted: function () {
    console.log(this)
    let screen = document.querySelector('.screen')
    const removeScreen = () => {
      screen.remove()
    }
    screen.addEventListener('webkitAnimationEnd', () => {
      removeScreen()
    })
    screen.addEventListener('animationend', () => {
      removeScreen()
    })

    setTimeout(() => {
      screen.classList.add('fadeOut')
    }, 200)
  }
})
