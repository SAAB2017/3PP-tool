<template>
  <div class="section">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Add Component</h1>
        <div class="component">
          <components-add></components-add>
        </div>
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
