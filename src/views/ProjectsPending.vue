<template>
  <div class="section products">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Pending projects</h1>
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
