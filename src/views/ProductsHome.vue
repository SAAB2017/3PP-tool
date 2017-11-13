<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-half">
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
