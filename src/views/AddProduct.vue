<template>
  <div class="section">
    <div class="columns is-mobile is-centered">
      <div class="column is-one-quarter">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Add product</h2>
        </div>
        <div class="column">
          <div class="component">
            <products-add></products-add>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductsAdd from '@/components/ProductsAdd'

  export default {
    components: {
      ProductsAdd
    }
  }
</script>
