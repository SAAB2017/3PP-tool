<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-half">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Licenses</h2>
        </div>
        <div>
          <div>
            <licenses-list></licenses-list>
          </div>
        </div>
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
