<template>
  <div class="section components">
    <h1>Components</h1>
    <div class="columns">
      <div class="column is-4">
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
