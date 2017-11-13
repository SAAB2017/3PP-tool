<template>
  <div class="section products">
    <div class="columns is-mobile is-centered">
      <div class="column is-half">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Projects</h2>
        </div>
        <div>
          <div>
            <projects-list></projects-list>
          </div>
        </div>
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
