<template>
  <div class="section products">
    <h1>Products</h1>
    <div class="columns">
      <div class="column is-4">
        <products-list></products-list>
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
