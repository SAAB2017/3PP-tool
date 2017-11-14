<template>
  <div class="section">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <div class="columns is-mobile is-centered">
          <h1 class="has-text-left">Add project</h1>
        </div>
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
