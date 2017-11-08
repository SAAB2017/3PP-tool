<template>
  <div class="section products">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Projects</h1>
        <projects-list></projects-list>
      </div>
    </div>
  </div>
</template>

<script>
  import ProjectsList from '@/components/ProjectsList'

  export default {
    components: {
      ProjectsList
    }
  }
</script>
