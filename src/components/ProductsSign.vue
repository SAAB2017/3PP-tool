<!-- View for showing all unsigned products -->
<template>
  <div class="products-list">
    <!-- Table that contains all unsigned products. Will grow to max-height and then
    become scrollable -->
    <table>
      <thead>
      <tr>
        <th scope="col">Product</th>
        <th scope="col">Version</th>
        <th scope="col">Created</th>
        <th scope="col">Last edited</th>
      </tr>
      </thead>
      <tbody class="tbodyhome">
      <tr v-for="product in products" @click="displayProduct(product)">
        <td scope="row" data-label="Product">{{ product.productName }}</td>
        <td scope="row" data-label="Version">{{ product.productVersion }}</td>
        <td scope="row" data-label="Created">{{ product.dateCreated }}</td>
        <td scope="row" data-label="Last edited">{{ product.lastEdited }}</td>
      </tr>
      </tbody>
    </table>

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
    data () {
      return {
        products: [],
        product: null,
        productVersion: null
      }
    },
    /* Fetches unsigned products from the database and puts them in products */
    mounted () {
      axios.get(this.$baseAPI + 'products/pending')
        .then(response => {
          this.products = response.data
        })
    },

    methods: {
      /**
       * Searches for unsigned products from the database matching the search-criteria
       */
      searchProduct () {
        // TODO Implement method
      },

      /**
       * Opens the view for signing a specific product with id id.
       * @param product The product to be signed
       */
      displayProduct (product) {
        console.log(`Product id is ${product}`)
        this.$router.push({ name: 'products_pending_id', params: { id: product.id } })
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
</style>
