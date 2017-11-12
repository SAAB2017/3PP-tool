<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-centered is-mobile">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Components</h2>
        </div>
        <div>
          <div>
        <components-list></components-list>
          </div>
        </div>
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
