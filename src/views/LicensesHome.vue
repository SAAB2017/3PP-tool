<template>
  <div class="section components">
    <h1>Licenses</h1>
    <div class="columns">
      <div class="column is-4">
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
