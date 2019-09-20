// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './App'
import router from './router'
import User from './classes/User'
import axios from 'axios'
import {isEmpty, generateId} from './classes/mainFunctions'

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
      windows: [],
      routes: [
        {
          url: '/person/create',
          name: 'Ingresar Persona'
        },
        {
          url: '/person/modify',
          name: 'Ver y Modificar Persona'
        },
        {
          url: '/user/create',
          name: 'Crear usuario'
        },
        {
          url: '/user/modify',
          name: 'Ver y Modificar usuario'
        },
        {
          url: '/category',
          name: 'Categorias'
        },
        {
          url: '/department',
          name: 'Departamento'
        },
        {
          url: '/mark',
          name: 'Marcas'
        },
        {
          url: '/article/state',
          name: 'Estado de Articulos'
        },
        {
          url: '/article/add',
          name: 'Agregar Articulo al inventario'
        },
        {
          url: '/article/modify',
          name: 'Ver y Modificar Articulos'
        },
        {
          url: '/article/assign',
          name: 'Asignar articulos'
        },
        {
          url: '/report',
          name: 'Reportes'
        }]
    }

    return obj
  },
  methods: {
    blur () {
      if(document.activeElement) {
        document.activeElement.blur();
      }
    },

    alert (options) {
      this.blur()
      options.id = generateId(15)
      this.alerts.push(options)
    },
    removeAlert (key) {
      this.alerts = this.alerts.filter(value => {
        return value.id != key
      })
    },
    window (options) {
      options.id = generateId(15)
      this.windows.push(options)
    },
    removeWindow () {
      this.windows = [];
    },
    confirm (options) {
      this.blur()
      options.id = generateId(15)
      this.confirms.push(options)
    },
    removeConfirm (key) {
      this.confirms = this.confirms.filter(value => {
        return value.id != key
      })
    },
    prompt (options) {
      this.blur()
      options.id = generateId(15)
      if (isNaN(options.maxlength)) {
        options.maxlength = null
      }
      if (isEmpty(options.placeholder)) {
        options.placeholder = null
      }
      this.prompts.push(options)
    },
    removePrompt (key) {
      this.prompts = this.prompts.filter(value => {
        return value.id != key
      })
    },
    generateToken () {
      this.axios.get('/token').then(res => {
        if (res.data.code !== 200) {
          console.error(res.data.message)
          return
        }
        window.localStorage.setItem('token', res.data.message)
      })
    },
    loadTokenUser () {
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
    'user.logged' (value) {
      if (!value) {
        this.user.access = []
        return
      }
    }
  },
  computed: {
    apiRoute () {
      return `${this.api.url}:${this.api.port}/api`
    },
    routeAvailable () {
      const path = this._route.fullPath
      const excludedpath = [
        '/'
      ]

      if (excludedpath.indexOf(path) > -1) {
        return true
      }
      
      let exists = false

      for (let route of this.user.access) {
        if (route.url == path) {
          exists = true
          break
        }
      }

      return exists
    }
  },
  router,
  components: {App},
  template: '<App/>',
  created () {
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
  mounted () {
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
