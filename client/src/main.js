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
      mainAccess: [
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
    },
    generateToken: function () {
      this.axios.get('/token').then(res => {
        if (res.data.code !== 200) {
          console.error(res.data.message)
          return
        }
        window.localStorage.setItem('token', res.data.message)
      })
    },
    loadTokenUser: function () {
      this.axios.get('/user/token').then(res => {
        if (res.data.code !== 200) {
          console.error('Error cargando usuario', res.data)
          return
        }

        this.user.Build(Object.assign({logged: true}, res.data.message))
      })
    }
  },
  watch: {
    'user.logged': function (value) {
      if (!value) {
        this.user.access = []
        return
      }

      const index = this.user.access.findIndex(route => {
        return route.url === '/user/logout'
      })

      if (index < 0) {
        this.user.access.push({
          url: '/user/logout',
          name: 'Salir'
        })
      }
    }
  },
  computed: {
    apiRoute: function () {
      return `${this.api.url}:${this.api.port}/api`
    },
    routeAvailable: function () {
      const path = this._route.fullPath
      const excludedpath = [
        '/'
      ]

      if (excludedpath.indexOf(path) > -1) {
        return true
      }

      return true
    },
    menu: function () {
      if (!Array.isArray(this.user.access)) {
        return this.mainAccess
      }

      return this.mainAccess.concat(this.user.access)
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
    this.axios.interceptors.request.use(config => {
      let token = window.localStorage.getItem('token')
      token = token || '0'
      config.headers.Authorization = token
      return config
    }, error => {
      return Promise.reject(error)
    })
    this.axios.interceptors.response.use(response => {
      if (response.status !== 200 || response.data.code !== 200) {
        return response
      }
      if (!response.data.tokenExpired) {
        return response
      }
      this.generateToken()
      return response
    })
    let token = window.localStorage.getItem('token')
    if (!isEmpty(token) && token !== 'undefined') {
      this.loadTokenUser()
      return
    }
    this.generateToken()
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
