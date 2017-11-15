<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-half" style="text-align: center">
        <h2 class="subtitle is-4">Licenses</h2>
      </div>
    </div>
    <div class="columns is-mobile is-centered">
      <div class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <licenses-list></licenses-list>
      </div>
    </div>

  </div>
</template>

<script>
  import LicensesList from '@/components/LicensesList'

  export default {
    components: {
      LicensesList
    }
  }
</script>
