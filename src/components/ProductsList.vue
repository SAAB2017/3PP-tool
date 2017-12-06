<!-- View for showing all signed products -->
<template>
  <div class="products-list">
    <!-- Table that contains all signed products. Will grow to max-height and then
    become scrollable -->

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

    <div id="table-div">
      <table>
        <thead>
        <tr style="background-color: white">
          <th scope="col" @click="sortName()">Product</th>
          <th scope="col" @click="sortVersion()">Version</th>
          <th scope="col" @click="sortCreated()">Created</th>
          <th scope="col" @click="sortEdited()">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" @click="displayComponent(product)">
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
        searchProducts: null,
        product: null,
        productVersion: null,
        message: '',
        sorted: '',
        reverse: 1
      }
    },

    /* Fetches signed products from the database and puts them in products */
    mounted () {
      console.log(this.$route.params)
      if (this.$route.params.type === 'signed') {
        this.message = 'Product "' + this.$route.params.sName + '" (version: ' + this.$route.params.sVersion + ') signed'
        this.$route.params.type = ''
        console.log(this.message)
      }
      this.getAllProducts()
      this.fade_out()
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

      /**
       * Fetches all products from database
       */
      getAllProducts () {
        axios.get(this.$baseAPI + 'products/')
          .then(response => {
            this.products = response.data
          })
      },

      /**
       * Shows this.message for some time then fades it away and removes it.
       */
      fade_out () {
        let msg = document.getElementById('message-text')
        let page = this
        let count = 1
        let fadeEffect = setInterval(function () {
          if (!msg.style.opacity) {
            msg.style.opacity = 1
          }
          if (count < 0.1) {
            page.message = ''
            clearInterval(fadeEffect)
          } else {
            count -= 0.01
            if (count < 0.2) {
              msg.style.opacity -= 0.1
            }
          }
        }, 100)
      },

      sortName () {
        if (this.sorted !== 'name') {
          this.sorted = 'name'
          this.reverse = 1
        }
        let t = this
        this.products.sort(function (a, b) {
          let lFirst = a.productName.toLowerCase()
          let lSecond = b.productName.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
      },

      sortVersion () {
        if (this.sorted !== 'version') {
          this.sorted = 'version'
          this.reverse = 1
        }
        let t = this
        this.products.sort(function (a, b) {
          let lFirst = a.productVersion.toLowerCase()
          let lSecond = b.productVersion.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
      },

      sortCreated () {
        if (this.sorted !== 'created') {
          this.sorted = 'created'
          this.reverse = 1
        }
        let t = this
        this.products.sort(function (a, b) {
          let lFirst = a.dateCreated.toLowerCase()
          let lSecond = b.dateCreated.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
      },

      sortEdited () {
        if (this.sorted !== 'created') {
          this.sorted = 'created'
          this.reverse = 1
        }
        let t = this
        this.products.sort(function (a, b) {
          let lFirst = a.lastEdited.toLowerCase()
          let lSecond = b.lastEdited.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
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

  .projects-list {
    margin-bottom: 20px;
  }
  tr {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  th:hover {
    cursor: pointer;
    background-color: lightgray;
  }
  tbody>tr:hover {
    cursor: pointer;
  }
</style>
