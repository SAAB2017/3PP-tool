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
      path: '/licenses/:id(\\d+)',
      name: 'License',
      component: License
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
      path: '/products/:id(\\d+)',
      name: 'Product',
      component: Product
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
      path: '/projects/:id(\\d+)',
      name: 'Project',
      component: Project
    },
    {
      path: '/projects/add',
      name: 'Add Project',
      component: AddProject
    }
  ]
})
