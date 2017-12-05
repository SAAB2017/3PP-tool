<template>
  <section class="section overview">
    <div class="columns is-mobile is-centered">
      <div class="column is-half" style="text-align: center;">
        <h2 class="subtitle is-4">Overview</h2>
      </div>
    </div>
    <div class="columns is-mobile is-centered">
      <div class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <overview-list></overview-list>
      </div>
    </div>
  </section>
</template>

<script>
  import OverviewList from '@/components/OverviewList'
  export default {
    name: 'navbar',
    components: {
      OverviewList
    }
  }
</script>
