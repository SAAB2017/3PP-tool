<template>
  <div class="section products">
    <div class="columns">
      <div class="column is-one-third is-offset-one-third">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Pending projects</h2>
        </div>
        <div>
          <div>
            <projects-sign></projects-sign>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ProjectsSign from '@/components/ProjectsSign'

  export default {
    components: {
      ProjectsSign
    }
  }
</script>
