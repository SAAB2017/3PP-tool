<template>
  <div class="section">
    <div class="columns is-mobile is-centered">
      <div class="column is-one-quarter">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Add project</h2>
        </div>
        <div class="column">
          <div class="component">
            <projects-add></projects-add>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ProjectsAdd from '@/components/ProjectsAdd'

  export default {
    components: {
      ProjectsAdd
    }
  }
</script>
