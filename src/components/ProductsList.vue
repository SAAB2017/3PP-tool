<template>
  <div class="products-list">
    <table class="table is-bordered">
      <thead>
      <tr>
        <th>Products</th>
        <th width=1%>Version</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in products">
        <td>{{ product.product }}</td>
        <td>{{ product.version }}</td>
      </tr>
      </tbody>
    </table>
    <div class="field">
      <p class="control">
        <input v-model="product" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="productVersion" class="input" type="text" placeholder="Version">
      </p>

      <p class="control">
        <a @click="addproduct" class="button is-primary">Add product</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        products: [],
        product: null,
        productVersion: null
      }
    },

    mounted() {
      axios.get(this.$baseAPI + 'products')
        .then(response => {
          this.products = response.data
        })
    },

    methods: {
      addproduct() {
        var data = {
          product: this.product,
          version: this.productVersion
        }

        axios.post(this.$baseAPI + 'products', data)
          .then(response => {
            if (response.data === "success") {
              this.product = null
              this.productVersion = null

              axios.get(this.$baseAPI + 'products')
                .then(response => {
                  this.products = response.data
                })
            }
          })
      }
    }
  }
</script>

<style scoped>
  .products-list {
    margin-bottom: 30px;
  }
</style>
