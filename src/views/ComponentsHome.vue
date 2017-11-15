<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-half" style="text-align: center">
          <h2 class="subtitle is-4">Components</h2>
      </div>
    </div>
    <div class="columns is-mobile is-centered">
      <div class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <components-list></components-list>
      </div>
    </div>
  </div>
</template>

<script>
  import ComponentsList from '@/components/ComponentsList'

  export default {
    components: {
      ComponentsList
    }
  }
</script>
