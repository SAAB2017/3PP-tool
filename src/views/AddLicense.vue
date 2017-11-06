<template>
  <div class="section">
    <h1>Add License</h1>
    <div class="columns">
      <div class="component">
        <licenses-add></licenses-add>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import LicensesAdd from '@/components/LicensesAdd'

  export default {
    components: {
      LicensesAdd
    }
  }
</script>
