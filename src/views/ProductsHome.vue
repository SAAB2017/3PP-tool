<template>
  <div class="section components">
    <div class="columns">
      <div class="column is-one-third is-offset-one-third">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Products</h2>
        </div>
        <div>
          <div>
            <products-list></products-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductsList from '@/components/ProductsList'

  export default {
    components: {
      ProductsList
    }
  }
</script>
