<template>
  <div class="section">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Add License</h1>
        <div class="columns">
          <div class="component">
            <licenses-add></licenses-add>
          </div>
        </div>
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
