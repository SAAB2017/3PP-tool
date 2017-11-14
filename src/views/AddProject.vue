<template>
  <div class="section">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Add Project</h1>
        <div class="columns">
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
