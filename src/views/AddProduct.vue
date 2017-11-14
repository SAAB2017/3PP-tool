<template>
  <div class="section">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <div class="columns is-mobile is-centered">
          <h1 class="has-text-left">Add product</h1>
        </div>
        <div class="columns">
          <div class="component">
            <products-add></products-add>
          </div>
        </div>
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
