import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import notFound from '@/views/notFound'
import personCreate from '@/views/person/create'
import personModify from '@/views/person/modify'
import userCreate from '@/views/user/create'
import userModify from '@/views/user/modify'
import categoryView from '@/views/category/view'
import markView from '@/views/marks/view'
import departmentView from '@/views/department/view'
import articleState from '@/views/article/state'
import articleAdd from '@/views/article/add'
import articleList from '@/views/article/list'
import articleAssign from '@/views/article/assign'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/person/create',
      name: 'personCreate',
      component: personCreate
    },
    {
      path: '/person/modify',
      name: 'personModify',
      component: personModify
    },
    {
      path: '/user/create',
      name: 'userCreate',
      component: userCreate
    },
    {
      path: '/user/modify',
      name: 'userModify',
      component: userModify
    },
    {
      path: '/category',
      name: 'categoryView',
      component: categoryView
    },
    {
      path: '/mark',
      name: 'markView',
      component: markView
    },
    {
      path: '/department',
      name: 'departmentView',
      component: departmentView
    },
    {
      path: '/article/state',
      name: 'articleState',
      component: articleState
    },
    {
      path: '/article/add',
      name: 'articleAdd',
      component: articleAdd
    },
    {
      path: '/article/assign',
      name: 'articleAssign',
      component: articleAssign
    },
    {
      path: '/article/assign/:serial',
      name: 'articleAssign',
      component: articleAssign
    },
    {
      path: '/article/list',
      name: 'articleList',
      component: articleList
    },
    {
      path: '*',
      name: 'notFound',
      component: notFound
    }
  ]
})
