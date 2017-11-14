<template>
  <div class="section">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <div class="columns is-mobile is-centered">
          <h1 class="has-text-left">Add license</h1>
        </div>
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
