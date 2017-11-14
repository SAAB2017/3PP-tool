<template>
  <div class="section">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <div class="columns is-mobile is-centered">
          <h1 class="has-text-left">Add component</h1>
        </div>
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
