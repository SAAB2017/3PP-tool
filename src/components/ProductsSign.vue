<!-- View for showing all unsigned products -->
<template>
  <div class="products-list">

    <div id="message-text">
      <p class="help is-success subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>
    </div>

    <div id="top-div-child" class="columns is-mobile is-centered">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-on:keyup="searchProduct()" v-model="searchProducts" class="input" type="text" placeholder="Find a product">
        </div>
        <div class="control">
          <button @click="searchProduct()" class="button is-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Table that contains all unsigned products. Will grow to max-height and then
    become scrollable -->
    <div id="table-div">
      <table>
        <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Version</th>
          <th scope="col">Created</th>
          <th scope="col">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" @click="displayProduct(product)">
          <td scope="row" data-label="Product">{{ product.productName }}</td>
          <td scope="row" data-label="Version">{{ product.productVersion }}</td>
          <td scope="row" data-label="Created">{{ product.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ product.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
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
        productVersion: null,
        searchProducts: ''
      }
    },
    /* Fetches unsigned products from the database and puts them in products */
    mounted () {
      this.getAllPending()
    },

    methods: {
      getAllPending () {
        axios.get(this.$baseAPI + 'products/pending')
          .then(response => {
            this.products = response.data
          })
      },
      /**
       * Searches for unsigned products from the database matching the search-criteria
       */
      searchProduct () {
        // TODO Implement method
        if (this.searchProducts.length === 0) {
          this.getAllPending()
          return
        }
        if (this.searchProducts !== 0 || this.searchProducts !== null || this.searchProducts !== '') {
          axios.get(this.$baseAPI + 'products/search/' + this.searchProducts).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.products = response.data
            } else {
              this.message = 'No product found!'
            }
          })
        } else {
          this.getAllPending()
        }
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
  .table-fixed {
    padding-top: 110px;
  }

  .search-fixed {
    position: fixed;
    top: 110px;
  }

  .products-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
