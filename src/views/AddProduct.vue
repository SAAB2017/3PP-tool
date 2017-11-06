<template>
  <div class="section">
    <h1>Add Product</h1>
    <div class="columns">
      <div class="component">
        <products-add></products-add>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ProductsAdd from '@/components/ProductsAdd'

  export default {
    components: {
      ProductsAdd
    }
  }
</script>
