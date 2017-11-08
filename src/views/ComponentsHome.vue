<template>
  <div class="section components">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Components</h1>
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
