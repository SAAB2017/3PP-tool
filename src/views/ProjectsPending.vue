<template>
  <div class="section products">
    <h1>Pending projects</h1>
    <div>
      <div>
        <projects-sign></projects-sign>
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
