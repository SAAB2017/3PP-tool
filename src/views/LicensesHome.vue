<template>
  <div class="section components">
    <div class="columns">
      <div class="column is-one-third is-offset-one-third">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Components</h2>
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
