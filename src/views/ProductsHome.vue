<template>
  <div class="section components">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Products</h1>
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
