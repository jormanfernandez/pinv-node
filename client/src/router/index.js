import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import notFound from '@/components/notFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '*',
      name: 'notFound',
      component: notFound
    }
  ]
})
