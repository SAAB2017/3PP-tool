<template>
  <div class="section components">
    <h1>Licenses</h1>
    <div class="columns">
      <div class="column is-4">
        <licenses-list></licenses-list>
      </div>
      <div class="column is-4">
        <licenses-add></licenses-add>
      </div>
    </div>
  </div>
</template>

<script>
  import LicensesList from '@/components/LicensesList'
  import LicensesAdd from '@/components/LicensesAdd'

  export default {
    components: {
      LicensesList,
      LicensesAdd
    }
  }
</script>
