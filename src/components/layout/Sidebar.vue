<template>
  <div class='menu'>
    <sidebar-item :label='dashboard'></sidebar-item>
    <!-- Lagt till licens -->
    <sidebar-item :label='licenses'></sidebar-item>
    <sidebar-item :label='components'></sidebar-item>
    <sidebar-item :label='products'></sidebar-item>
    <sidebar-item :label='projects'></sidebar-item>
  </div>
</template>

<<script>
  import SidebarItem from '@/components/layout/SidebarItem'

  export default {
    name: 'sidebar',
    components: {
      SidebarItem
    },

    data () {
      return {
        dashboard: {
          name: 'Dashboard',
          items: [{
            name: 'Overview',
            link: '/'
          }]
        },

        licenses: {
          name: 'Licenses',
          items: [{
            name: 'List licenses',
            link: '/licenses',
            children: [{
              name: 'Add',
              link: '/licenses/add'
            }]
          }]
        },

        components: {
          name: 'Components',
          items: [{
            name: 'List components',
            link: '/components',
            children: [{
              name: 'Add',
              link: '/components/add'
            },
            {
              name: 'Pending',
              link: '/components/pending'
            }]
          }]
        },

        products: {
          name: 'Products',
          items: [{
            name: 'List products',
            link: '/products',
            children: [{
              name: 'Add',
              link: '/products/add'
            },
            {
              name: 'Pending',
              link: '/products/pending'
            }]
          }]
        },

        projects: {
          name: 'Projects',
          items: [{
            name: 'List projects',
            link: '/projects',
            children: [{
              name: 'Add',
              link: '/projects/add'
            },
            {
              name: 'Pending',
              link: '/projects/pending'
            }]
          }]
        }
      }
    }
  }
</script>

<style scoped>
  .menu {
    position: relative;
    width: 200px;
    float: left;
    padding: 15px;
  }
</style>
