import Vue from 'vue'
import Router from 'vue-router'
import Overview from '@/views/Overview'

import LicensesHome from '@/views/LicensesHome'
import AddLicense from '@/views/AddLicense'

import ComponentsHome from '@/views/ComponentsHome'
import Component from '@/views/Component'
import AddComponent from '@/views/AddComponent'


import ProductsHome from '@/views/ProductsHome'
import AddProduct from '@/views/AddProduct'

import ProjectsHome from '@/views/ProjectsHome'
import AddProject from '@/views/AddProject'

import SignProject from '@/views/SignProject'
import ProjectsPending from '@/views/ProjectsPending'

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
      path: '/licenses/add',
      name: 'Add License',
      component: AddLicense
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
      path: '/components/add',
      name: 'Add Component',
      component: AddComponent
    },
    {
      path: '/products',
      name: 'Products',
      component: ProductsHome
    },
    {
      path: '/products/add',
      name: 'Add Product',
      component: AddProduct
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsHome
    },
    {
      path: '/projects/add',
      name: 'Add Project',
      component: AddProject
    },
    {
      path: '/projects/pending',
      name: 'Projects pending',
      component: ProjectsPending
    },
    {
      path: '/projects/pending/:id(\\d+)',
      name: 'Sign Project',
      component: SignProject
    }

  ]
})
