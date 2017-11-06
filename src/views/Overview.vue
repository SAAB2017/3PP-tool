<template>
  <section class="section overview">
    <h1>Overview</h1>
    <div class="columns">
      <div class="column is-4">
        <components-list></components-list>
      </div>
      <div class="column is-4">
        <products-list></products-list>
      </div>
      <div class="column is-4">
        <projects-list></projects-list>
      </div>
    </div>
  </section>
</template>

<script>
  import ComponentsList from '@/components/ComponentsList'
  import ProductsList from '@/components/ProductsList'
  import ProjectsList from '@/components/ProjectsList'

  export default {
    name: 'navbar',
    components: {
      ComponentsList,
      ProductsList,
      ProjectsList
    }
  }
</script>
