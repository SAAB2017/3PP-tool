<template>
  <div class="section">
    <div class="columns is-mobile is-centered">
      <div class="column is-one-quarter">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Add license</h2>
        </div>
        <div class="column">
          <div class="component">
            <licenses-add></licenses-add>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LicensesAdd from '@/components/LicensesAdd'

  export default {
    components: {
      LicensesAdd
    }
  }
</script>
