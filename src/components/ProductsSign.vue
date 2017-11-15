<!-- View for showing all unsigned products -->
<template>
  <div class="products-list">
    <!-- Table that contains all unsigned products. Will grow to max-height and then
    become scrollable -->
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
          <td>{{ product.productName}}</td>
          <td>{{ product.productVersion }}</td>
          <td>{{ product.dateCreated }}</td>
          <td>{{ product.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Field for searching for a product in the table. Uses "searchProduct"-method -->
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

    /* Fetches unsigned products from the database and puts them in products */
    mounted() {
      axios.get(this.$baseAPI + 'products/pending')
        .then(response => {
          this.products = response.data
        })
    },

    methods: {
      /**
       * Searches for unsigned products from the database matching the search-criteria
       */
      searchProduct(){
        // TODO Implement method
      },

      /**
       * Opens the view for signing a specific product with id id.
       * @param product The product to be signed
       */
      displayComponent(product) {
        this.$router.push({ name: "Sign Product", params: { id: product.id } })
      }
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
