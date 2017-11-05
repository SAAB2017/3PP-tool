import Vue from 'vue'
import Router from 'vue-router'
import Overview from '@/views/Overview'

import LicensesHome from '@/views/LicensesHome'

import ComponentsHome from '@/views/ComponentsHome'
import Component from '@/views/Component'

import ProductsHome from '@/views/ProductsHome'

import ProjectsHome from '@/views/ProjectsHome'

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
      path: '/licenses',
      name: 'Licenses',
      component: LicensesHome
    },
    {
      path: '/components',
      name: 'Components',
      component: ComponentsHome,
    },
    {
      path: '/components/:id(\\d+)',
      name: 'Component',
      component: Component
    },
    {
      path: '/products',
      name: 'Products',
      component: ProductsHome
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsHome
    }
  ]
})
