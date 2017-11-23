<!-- View for showing all signed products -->
<template>
  <div class="products-list">
    <!-- Table that contains all signed products. Will grow to max-height and then
    become scrollable -->

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchProduct()" v-model="searchProducts" class="input" type="text" placeholder="Find a product">
      </div>
      <div class="control">
        <button @click="searchProduct()" class="button is-primary">Search</button>
      </div>
    </div>

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
        <tr v-for="product in products" @click="displayComponent(product)">
          <td scope="row" data-label="Product">{{ product.productName }}</td>
          <td scope="row" data-label="Version">{{ product.productVersion }}</td>
          <td scope="row" data-label="Created">{{ product.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ product.lastEdited }}</td>
        </tr>
        </tbody>
      </table>

    <!-- Field for searching for a product in the table. Uses "searchProduct"-method -->

    <div class="columns is-mobile is-centered" style="justify-content: center">
      <products-add-modal></products-add-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ProductsAddModal from '@/components/ProductsAddModal'

  export default {
    components: {
      ProductsAddModal
    },

    data () {
      return {
        products: [],
        searchProducts: null,
        product: null,
        productVersion: null
      }
    },

    /* Fetches signed products from the database and puts them in products */
    mounted () {
      this.getAllProducts()
    },

    methods: {
      /**
       * Searches for signed products from the database matching the search-criteria
       */
      searchProduct () {
        if (this.searchProducts.length === 0) {
          this.getAllProducts()
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
          this.getAllProducts()
        }
      },

      /**
       * Opens the view for a specific product with id id.
       * @param product The product to be viewed
       */
      displayComponent (product) {
        this.$router.push({ name: 'products_id', params: { id: product.id } })
      },

      getAllProducts () {
        axios.get(this.$baseAPI + 'products/')
          .then(response => {
            this.products = response.data
          })
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
