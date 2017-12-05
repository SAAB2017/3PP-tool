<template>
  <section class="section overview">
    <div class="columns is-mobile is-centered">
      <h1 class="title">Overview</h1>
    </div>
    <div class="columns is-mobile is-centered is-multiline">
      <div class="column is-half-desktop is-full-mobile is-two-thirds-tablet">
        <licenses-list></licenses-list>
      </div>
      <div class="column is-half-desktop is-full-mobile is-two-thirds-tablet">
        <components-list></components-list>
      </div>
      <div class="column is-half-desktop is-full-mobile is-two-thirds-tablet">
        <products-list></products-list>
      </div>
      <div class="column is-half-desktop is-full-mobile is-two-thirds-tablet">
        <projects-list></projects-list>
      </div>
    </div>
  </section>
</template>

<script>
  import ComponentsList from '@/components/ComponentsList'
  import ProductsList from '@/components/ProductsList'
  import ProjectsList from '@/components/ProjectsList'
  import LicensesList from '@/components/LicensesList'

  export default {
    name: 'navbar',
    components: {
      LicensesList,
      ComponentsList,
      ProductsList,
      ProjectsList
    }
  }
</script>
