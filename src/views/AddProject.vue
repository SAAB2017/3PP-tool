<template>
  <div class="section">
    <h1>Add Component</h1>
    <div class="columns">
      <div class="component">
        <projects-add></projects-add>
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
