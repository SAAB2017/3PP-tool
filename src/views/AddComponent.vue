<template>
  <div class="section">
    <h1>Add Component</h1>
    <div class="columns">
      <div class="component">
        <components-add></components-add>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ComponentsAdd from '@/components/ComponentsAdd'

  export default {
    components: {
      ComponentsAdd
    }
  }
</script>
