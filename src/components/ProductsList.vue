<style>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .4s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .plist-enter-active, .plist-leave-active {
    transition: all 0.7s;
  }
  .plist-enter, .plist-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

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

        <transition-group name="plist2" appear>
        <tr v-for="product in products" @click="displayComponent(product)" v-bind:key="product" class="plist-item">
          <td scope="row" data-label="Product">{{ product.productName }}</td>
          <td scope="row" data-label="Version">{{ product.productVersion }}</td>
          <td scope="row" data-label="Created">{{ product.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ product.lastEdited }}</td>
        </tr>
        </transition-group>

        <tr v-if="showPaginatorClick || products.length !== payload.meta.count">
          <div id="paginator" style="text-align: center;" @click="getMore()"><a class="button is-primary">Hämta in fler</a></div>
        </tr>
        </tbody>
      </table>
    </div>

   </div>
</template>

<script>
  import axios from 'axios'
  import payloadcfg from '../../backend/routes/config'

  export default {
    data () {
      return {
        products: [],
        product: null,
        productVersion: null,
        searchProducts: null,
        searching: false,
        message: '',
        sorted: '',
        showPaginatorClick: true,
        payload: this.payloadFactory()
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
      this.payload = this.payloadFactory()
      console.log(JSON.stringify(this.payload))
      this.getNext = this.getNext.bind(this, 'products/')
      this.getMore = this.getMore.bind(this, 'products/')
      this.getNextSearchQuery = this.getNextSearchQuery.bind(this, 'products/')
      this.getNext(true)
      this.fade_out()
    },

    methods: {
      payloadFactory: payloadcfg.payloadInit.bind(null, 'product'),
      /**
       * Searches for signed products from the database matching the search-criteria
       */
      searchProduct () {
        this.searching = true
        let sort = this.payload.sort
        this.payload = this.payloadFactory()
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchProducts.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.products = []
          this.getNext(true)
          return
        }
        if ((this.searchProducts.length !== 0) && (this.searchProducts !== null) && (this.searchProducts !== '')) {
          const path = `products/search/${this.searchProducts}/${this.payload.links.next}${this.payload.sort.column}${this.payload.sort.order}`
          axios.get(this.$baseAPI + path).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.payload = response.data
              console.log(JSON.stringify(response.data))
              this.products = [...this.payload.items]
            } else {
              console.log('Moterfucaasdd')
              this.message = 'No component found!'
            }
          })
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

      // GET METHODS
      getMore (uri, replaceItemsList) {
        if (this.searching === false) {
          this.getNext(uri, replaceItemsList)
        } else {
          this.getNextSearchQuery(uri, replaceItemsList)
        }
      },
      getNext (uri, replaceItemsList) {
        console.log(this.$baseAPI + uri + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
        axios.get(this.$baseAPI + uri + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.products = [...this.payload.items] : this.products = [...this.products, ...this.payload.items]
            this.products.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
          })
      },
      getNextSearchQuery (uri, replaceItemsList) {
        axios.get(this.$baseAPI + uri + 'search/' + this.searchProducts + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.products = [...this.payload.items] : this.products = [...this.products, ...this.payload.items]
            if (this.products.length === this.payload.meta.count) {
              this.showPaginatorClick = null
            } else {
              this.showPaginatorClick = true
            }
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
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=productName'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
      },
      sortVersion () {
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=productVersion'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
      },
      sortCreated () {
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=dateCreated'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
      },
      sortEdited () {
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=lastEdited'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
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
