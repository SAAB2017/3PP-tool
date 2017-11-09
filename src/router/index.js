import Vue from 'vue'
import Router from 'vue-router'
import Overview from '@/views/Overview'

import LicensesHome from '@/views/LicensesHome'
import License from '@/views/License'
import AddLicense from '@/views/AddLicense'

import ComponentsHome from '@/views/ComponentsHome'
import Component from '@/views/Component'
import AddComponent from '@/views/AddComponent'
import ComponentsPending from '@/views/ComponentsPending'

import ProductsHome from '@/views/ProductsHome'
import Product from '@/views/Product'
import AddProduct from '@/views/AddProduct'
import ProductsPending from '@/views/ProductsPending'
import SignProduct from '@/views/SignProduct'

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
      name: 'licenses_id',
      component: License
    },
    {
      path: '/licenses/add',
      name: 'licenses_add',
      component: AddLicense
    },
    {
      path: '/components',
      name: 'components',
      component: ComponentsHome,
    },
    {
      path: '/components/:id(\\d+)',
      name: 'components_id',
      component: Component
    },
    {
      path: '/components/add',
      name: 'components_add',
      component: AddComponent
    },
    {
      path: '/components/pending',
      name: 'components_pending',
      component: ComponentsPending
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsHome
    },
    {
      path: '/products/:id(\\d+)',
      name: 'products_id',
      component: Product
    },
    {
      path: '/products/add',
      name: 'products_add',
      component: AddProduct
    },
    {
      path: '/products/pending',
      name: 'products_pending',
      component: ProductsPending
    },
    {
      path: '/products/pending/:id(\\d+)',
      name: 'products_pending_id',
      component: SignProduct
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsHome
    },
    {
      path: '/projects/:id(\\d+)',
      name: 'projects_id',
      component: Project
    },
    {
      path: '/projects/add',
      name: 'projects_add',
      component: AddProject
    },
    {
      path: '/projects/pending',
      name: 'projects_pending',
      component: ProjectsPending
    },
    {
      path: '/projects/pending/:id(\\d+)',
      name: 'projects_pending_id',
      component: SignProject
    }

  ]
})
