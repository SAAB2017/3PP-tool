<template>
  <section class="section overview">
    <h1>Overview</h1>
    <div class="columns is-desktop">
      <div class="column is-one-third-desktop is-full-mobile is-half-tablet">
        <components-list></components-list>
      </div>
      <div class="column is-one-third-desktop is-full-mobile is-half-tablet">
        <products-list></products-list>
      </div>
      <div class="column is-one-third-desktop is-full-mobile is-half-tablet">
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
