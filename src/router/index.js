import Vue from 'vue'
import Router from 'vue-router'
import Overview from '@/views/Overview'
import ComponentsHome from '@/views/ComponentsHome'
import Component from '@/views/Component'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
    path: '/',
    name: 'Overview',
    component: Overview
    },
    {
      path: '/components',
      name: 'Components',
      component: ComponentsHome,
    },
    {
      path:'/components/:id(\\d+)',
      name: 'Component',
      component: Component
    }
  ]
})
