<template>
  <div class="section components">
    <h1>Components</h1>
    <div class="columns">
      <div class="column is-3">
        <components-list></components-list>
      </div>
      <div class="column is-3">
        <components-add></components-add>
      </div>
    </div>
  </div>
</template>

<script>
  import ComponentsList from '@/components/ComponentsList'
  import ComponentsAdd from '@/components/ComponentsAdd'

  export default {
    components: {
      ComponentsList,
      ComponentsAdd
    }
  }
</script>
