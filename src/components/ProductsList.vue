<template>
  <div class="products-list">
    <div class="vertical-menu" style="max-height: 600px; min-width: 420px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th width="45%">Product</th>
          <th width=15%>Version</th>
          <th width="20%">Created</th>
          <th width="20%">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" @click="displayComponent(product)">
          <td>{{ product.productName }}</td>
          <td>{{ product.productVersion }}</td>
          <td>{{ product.dateCreated }}</td>
          <td>{{ product.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchProducts" class="input" type="text" placeholder="Find a product">
      </div>
      <div class="control">
        <a @click="searchProduct" class="button is-primary">Search</a>
      </div>
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

      searchProduct(){
        // TODO Implement method
      },

      displayComponent(product) {
        this.$router.push({ name: "products_id", params: { id: product.id } })
      }
      /* TODO should be able to delete this
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
      } */
    }
  }
</script>

<style scoped>
  .products-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
  .vertical-menu {
    width: 100%;
    overflow-y: auto;
  }
</style>
