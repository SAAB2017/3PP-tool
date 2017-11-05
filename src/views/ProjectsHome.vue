<template>
  <div class="section products">
    <h1>Projects</h1>
    <div class="columns">
      <div class="column is-4">
        <projects-list></projects-list>
      </div>
      <div class="column is-4">
        <projects-add></projects-add>
      </div>
    </div>
  </div>
</template>

<script>
  import ProjectsList from '@/components/ProjectsList'
  import ProjectsAdd from '@/components/ProjectsAdd'

  export default {
    components: {
      ProjectsList,
      ProjectsAdd
    }
  }
</script>
