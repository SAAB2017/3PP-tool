<template>
  <div class="section products">
    <div class="columns is-mobile is-centered">
      <div class="column is-half">
        <div style="text-align: center;">
          <h2 class="subtitle is-4">Pending products</h2>
        </div>
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
