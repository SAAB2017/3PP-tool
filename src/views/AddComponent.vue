<template>
  <div class="section">
    <div class="columns is-mobile is-centered">
      <div class="column is-one-quarter">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Add component</h2>
        </div>
        <div class="column">
          <div class="component">
            <components-add></components-add>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ComponentsAdd from '@/components/ComponentsAdd'

  export default {
    components: {
      ComponentsAdd
    }
  }
</script>
