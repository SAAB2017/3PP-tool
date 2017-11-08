<template>
  <div class="section components">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Licenses</h1>
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
