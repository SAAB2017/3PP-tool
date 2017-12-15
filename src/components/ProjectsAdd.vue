<style>
  .product-fade-enter-active, .product-fade-leave-active {
    transition: opacity .4s ease;
  }
  .product-fade-enter, .product-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .list-enter-active, .list-leave-active {
    transition: all 0.7s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<!-- View for adding Projects -->
<template>
  <div class="project-list">
    <div id="message-text">
      <p v-for="error in errorList" class="help is-danger subtitle is-6" style="text-align: center">{{ error }}</p>
    </div>
    <!-- Fields for adding name and version to the project -->
    <div class="field" style="padding-top: 15px">
      <p class="control">
        <input v-model="projectName" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="projectVersion" class="input" type="text" placeholder="Version">
      </p>
    </div>

    <!-- Table for picking products to bind to the project. Shows all approved
    products but becomes scrollable after reaching max-size (because of class="vertical-menu") -->
    <table>
      <thead>
      <tr>
        <td style="width: 25px"></td>
        <th scope="col">Product</th>
        <th scope="col">Version</th>
      </tr>
      </thead>
      <tbody class="tbodyadd">
      <transition-group  name="list" appear>
      <tr v-for="product in products" class="list-item" v-bind:key="product">
        <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=product.id v-model.number="checkedProducts"></td>
        <td scope="row" data-label="Product">{{ product.productName }}</td>
        <td scope="row" data-label="Version">{{ product.productVersion }}</td>
      </tr>
      </transition-group>
      <tr v-if="showPaginatorClick">
        <div id="paginator" style="text-align: center;" @click="getMore()"><a class="button is-primary">Get more</a></div>
      </tr>
      </tbody>
    </table>
    <!-- Field for searching for products. Uses "searchProduct"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchProducts" class="input" type="text" placeholder="Find a product">
      </div>
      <div class="control">
        <a @click="searchProduct()" class="button is-primary">Search</a>
      </div>
    </div>

    <!-- Textarea for adding a comment to the project -->
    <div class="field">
      <div class="control">
        <textarea v-model="projectComment" class="textarea" placeholder="Comment for project"></textarea>
      </div>
    </div>

    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProject()" class="button is-primary">Add Project</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {

    data () {
      return {
        products: [],
        checkedProducts: [],
        projectName: '',
        projectVersion: '',
        projectComment: '',
        searchProducts: '',
        searching: false, // nothing entered in the search bar
        payload: this.payloadInit('product'),
        errorList: []
      }
    },
    /* Fetches liceses from the database and puts them in products */
    mounted () {
      this.getNext(false)
      // this.getAllProducts()
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
          this.searchProduct(a)
        }
      },
      products: function (a) {
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
      // used for the "product" list, used for adding to project, since we're not wanting payloads of project

      getMore (replaceItemsList) {
        let _this = this
        if (this.searching === false) {
          _this.getNext(replaceItemsList)
        } else {
          _this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (replaceItemsList) {
        let _this = this
        axios.get(this.$baseAPI + 'products/all' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            if (replaceItemsList) {
              _this.products = _this.payload.items
            } else {
              _this.products = _this.products.concat(_this.payload.items)
            }
            _this.products.length === _this.payload.meta.count ? _this.showPaginatorClick = null : _this.showPaginatorClick = true
          }).catch(err => console.log(err))
      },
      getNextSearchQuery (replaceItemsList) {
        let _this = this
        if (this.products.length < this.payload.meta.count) {
          axios.get(this.$baseAPI + 'products/search/' + this.searchProducts + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
            .then(response => {
              _this.payload = response.data
              if (replaceItemsList) {
                _this.products = _this.payload.items
              } else {
                _this.products = _this.products.concat(_this.payload.items)
              }
              if (_this.products.length === _this.payload.meta.count) {
                _this.showPaginatorClick = null
              } else {
                _this.showPaginatorClick = true
              }
            }).catch(err => console.log(err))
        } else {
          this.showPaginatorClick = null
        }
      },
      /**
       * Add a project to the database according to the fields in the view
       */
      addProject () {
        let data = {
          projectName: this.projectName,
          projectVersion: this.projectVersion,
          comment: this.projectComment,
          products: this.checkedProducts
        }
        this.errorList = this.checkInput(this.projectName, this.projectVersion, this.checkedProducts)

        if (this.errorList.length === 0) {
          axios.post(this.$baseAPI + 'projects/add', data)
            .then(response => {
              if (response.data === 'success') {
                this.projectName = null
                this.projectVersion = null
                this.projectComment = null
                axios.get(this.$baseAPI + 'projects')
                  .then(response => {
                    this.projects = response.data
                  })

                this.$router.go()
              } else if (response.data === 'error') {
                this.errorList = []
                this.errorList[0] = 'A project with the name "' + this.projectName + '" and version "' + this.projectVersion + '" already exists.'
              }
            })
        }
      },

      checkInput (name, version, checked) {
        let errors = []
        if (name === null || name.length === 0 || name === '') {
          errors[errors.length] = 'A name must be provided'
        }
        if (version === null || version.length === 0 || version === '') {
          errors[errors.length] = 'A version must be provided'
        }
        if (checked === null || checked.length === 0) {
          errors[errors.length] = 'A product must be binded to the project'
        }
        return errors
      },

      searchProduct (search) {
        const path = 'products/search/' + search + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
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
      }

      /**
       * Searches for liceses from the database matching the search-criteria
       */
    }
  }
</script>

<style scoped>
  .project-list {
    margin-bottom: 30px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }

</style>
