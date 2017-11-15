<template>
  <div class="section products">
    <div class="columns is-mobile is-centered">
      <div class="column is-half" style="text-align: center;">
        <h2 class="subtitle is-4">Projects</h2>
      </div>
    </div>
    <div class="columns is-mobile is-centered">
      <div class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
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
