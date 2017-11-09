<template>
  <div class="section components">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Pending components</h1>
        <div>
          <div>
            <components-sign></components-sign>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ComponentsSign from '@/components/ComponentsSign'

  export default {
    components: {
      ComponentsSign
    }
  }
</script>
