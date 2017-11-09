<template>
  <div class="section products">
    <div class="columns">
      <div class="column is-one-quarter is-offset-one-third">
        <h1>Pending products</h1>
        <div>
          <div>
            <products-sign></products-sign>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductsSign from '@/components/ProductsSign'

  export default {
    components: {
      ProductsSign
    }
  }
</script>
