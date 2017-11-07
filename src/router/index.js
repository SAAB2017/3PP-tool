import Vue from 'vue'
import Router from 'vue-router'
import Overview from '@/views/Overview'

import LicensesHome from '@/views/LicensesHome'
import License from '@/views/License'
import AddLicense from '@/views/AddLicense'

import ComponentsHome from '@/views/ComponentsHome'
import Component from '@/views/Component'
import AddComponent from '@/views/AddComponent'


import ProductsHome from '@/views/ProductsHome'
import Product from '@/views/Product'
import AddProduct from '@/views/AddProduct'

import ProjectsHome from '@/views/ProjectsHome'
import Project from '@/views/Project'
import AddProject from '@/views/AddProject'

import SignProject from '@/views/SignProject'
import ProjectsPending from '@/views/ProjectsPending'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Overview
    },
    {
      path: '/licenses',
      name: 'licenses',
      component: LicensesHome
    },
    {
      path: '/licenses/:id(\\d+)',
      name: 'license',
      component: License
    },
    {
      path: '/licenses/add',
      name: 'add_license',
      component: AddLicense
    },
    {
      path: '/components',
      name: 'components',
      component: ComponentsHome,
    },
    {
      path: '/components/:id(\\d+)',
      name: 'component',
      component: Component
    },
    {
      path: '/components/add',
      name: 'add_component',
      component: AddComponent
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsHome
    },
    {
      path: '/products/:id(\\d+)',
      name: 'product',
      component: Product
    },
    {
      path: '/products/add',
      name: 'add_product',
      component: AddProduct
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsHome
    },
    {
      path: '/projects/:id(\\d+)',
      name: 'project',
      component: Project
    },
    {
      path: '/projects/add',
      name: 'add_project',
      component: AddProject
    },
    {
      path: '/projects/pending',
      name: 'projects_pending',
      component: ProjectsPending
    },
    {
      path: '/projects/pending/:id(\\d+)',
      name: 'sign_project',
      component: SignProject
    }

  ]
})
