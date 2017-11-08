<template>
  <section class="section overview">
    <div class="columns is-mobile is-centered">
      <h1 class="title">Overview</h1>
    </div>
    <div class="columns is-mobile is-centered is-multiline">
      <div class="column is-one-third-desktop is-two-thirds-mobile is-half-tablet">
        <components-list></components-list>
      </div>
      <div class="column is-one-third-desktop is-two-thirds-mobile is-half-tablet">
        <products-list></products-list>
      </div>
      <div class="column is-one-third-desktop is-two-thirds-mobile is-half-tablet">
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
