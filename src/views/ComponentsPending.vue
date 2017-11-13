<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-half">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Pending components</h2>
        </div>
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
