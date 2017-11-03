<template>
  <div class="section products">
    <h1>Products</h1>
    <div class="columns">
      <div class="column is-3">
        <products-list></products-list>
      </div>
      <div class="column is-3">
        <products-add></products-add>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductsList from '@/components/ProductsList'
  import ProductsAdd from '@/components/ProductsAdd'

  export default {
    components: {
      ProductsList,
      ProductsAdd
    }
  }
</script>
