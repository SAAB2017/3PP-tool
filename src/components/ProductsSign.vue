<<<<<<<<!-- View for showing all unsigned products -->
<template>
  <div class="products-list">

    <div id="message-text">
      <p class="help is-success subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>
    </div>

    <div id="top-div-child" class="columns is-mobile is-centered">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-model="searchProducts" class="input" type="text" placeholder="Find a product">
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
        <tr style="background-color: white">
          <th scope="col" @click="sortName()">Product</th>
          <th scope="col" @click="sortVersion()">Version</th>
          <th scope="col" @click="sortCreated()">Created</th>
          <th scope="col" @click="sortEdited()">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <transition-group  name="list" appear>
        <tr v-for="product in products" @click="displayProduct(product)" v-bind:key="product" class="plist-item">
          <td scope="row" data-label="Product">{{ product.productName }}</td>
          <td scope="row" data-label="Version">{{ product.productVersion }}</td>
          <td scope="row" data-label="Created">{{ product.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ product.lastEdited }}</td>
        </tr>
        </transition-group>
        <tr v-if="showPaginatorClick">
          <div id="paginator" style="text-align: center;" @click="getMore()"><a class="button is-primary">Get more</a></div>
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
        searchProducts: '',
        sorted: '',
        reverse: 1,
        searching: false,
        message: '',
        showPaginatorClick: true,
        payload: this.payloadInit('product')
      }
    },
    /* Fetches unsigned products from the database and puts them in products */
    mounted () {
      this.payload = this.payloadInit('product')
      this.getMore(true)
      // this.getAllPending()
    },
    watch: {
      searchProducts: function (a) {
        if (a.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.products = []
          this.payload = this.payloadInit('product')
          this.getNext(true)
        } else if (a.length > 0) {
          this.searching = true
          let sort = this.payload.sort
          this.payload = this.payloadInit('product')
          this.payload.sort = sort
          this.searchComponent(a)
        }
      },
      components: function (a) {
        if (a.length === this.payload.meta.count) {
          this.showPaginatorClick = false
        } else if (a.length < this.payload.meta.count) {
          this.showPaginatorClick = true
        }
      }
    },
    methods: {
      payloadInit(type) {
        return { // a default payload, can/should be extended
          items: [],
          links: {
            prev: '?offset=0&amount=' + 25,
            current: '?offset=0&amount=' + 25,
            next: '?offset=0&amount=' + 25
          },
          sort: {
            column: '&sort=' + type + 'Name',
            order: '&order=asc'
          },
          meta: {
            current: 0,
            count: 0
          },
          errors: {
            message: [],
            status: 'OK'
          },
          errorflag: false
        }
      },
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (replaceItemsList) {
        let _this = this
        axios.get(this.$baseAPI + 'products/pending/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            _this.payload = response.data
            replaceItemsList ? _this.products = _this.payload.items : _this.products = _this.products.concat(_this.payload.items)
            _this.products.length === _this.payload.meta.count ? _this.showPaginatorClick = null : _this.showPaginatorClick = true
          }).catch(err => {
            console.log(err)
          })
      },
      getNextSearchQuery (replaceItemsList) {
        let _this = this
        axios.get(this.$baseAPI + 'products/pending/search/' + this.searchProducts + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            _this.payload = response.data
            replaceItemsList ? _this.products = _this.payload.items : _this.products = _this.products.concat(_this.payload.items)
            if (_this.products.length === _this.payload.meta.count) {
              _this.showPaginatorClick = null
            } else {
              _this.showPaginatorClick = true
            }
          }).catch(err => {
            console.log(err)
          })
      },

      getAllPending () {
        axios.get(this.$baseAPI + 'products/pending')
          .then(response => {
            this.products = response.data
          })
      },
      /**
       * Searches for unsigned products from the database matching the search-criteria
       */
      searchComponent (search) {
        const path = 'products/pending/search/' + search + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
        let _this = this
        axios.get(this.$baseAPI + path).then(response => {
          if (response.data != null) {
            _this.payload = response.data
            _this.products = _this.payload.items
            if (_this.products.length === _this.payload.meta.count) {
              _this.showPaginatorClick = false
            }
          } else {
            _this.message = 'No component found!'
          }
        }).catch(err => {
          console.log(err)
        })
      },

      /**
       * Opens the view for signing a specific product with id id.
       * @param product The product to be signed
       */
      displayProduct (product) {
        this.$router.push({ name: 'products_id', params: { id: product.id } })
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
          this.ssorted = 'created'
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

  .products-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
