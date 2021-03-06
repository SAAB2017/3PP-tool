<style>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .127s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .plist-enter-active, .plist-leave-active {
    transition: all 0.327s;
  }
  .plist-enter, .plist-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
<!-- View for adding Products -->
<template>
  <div class="product-list">
    <div id="message-text">
      <p v-for="error in errorList" class="help is-danger subtitle is-6" style="text-align: center; padding-bottom: 2px">{{ error }}</p>
    </div>
    <!-- Fields for adding name and version to the product -->
    <div class="field" style="padding-top: 15px">
      <p class="control">
        <input v-model="productName" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="productVersion" class="input" type="text" placeholder="Version">
      </p>
    </div>

    <!-- Table for picking components to bind to the product. Shows all approved
    components but becomes scrollable after reaching max-size (because of class="vertical-menu") -->
    <table>
      <thead>
      <tr>
        <td style="width: 25px"></td>
        <th scope="col">Component</th>
        <th scope="col">Version</th>
      </tr>
      </thead>
      <tbody class="tbodyadd">
      <transition-group name="list" appear>
      <tr v-for="component in components" v-bind:key="component" class="plist-item">
        <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=component.id v-model.number="checkedComponents"></td>
        <td scope="row" data-label="Component">{{ component.componentName }}</td>
        <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
      </tr>
    </transition-group>
      <tr v-if="showPaginatorClick">
        <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Get more</a></div>
      </tr>
      </tbody>
    </table>
    <!-- Field for searching for components. Uses "searchComponent"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchComponents" class="input" type="text" placeholder="Find a component">
      </div>
      <div class="control">
        <a @click="searchComponent()" class="button is-primary">Search</a>
      </div>
    </div>

    <!-- Textarea for adding a comment to the product -->
    <div class="field">
      <div class="control">
        <textarea v-model="productComment" class="textarea" placeholder="Comment for product"></textarea>
      </div>
    </div>

    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProduct()" class="button is-primary">Add Product</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {

    data () {
      return {
        components: [],
        checkedComponents: [],
        productName: '',
        productVersion: '',
        productComment: '',
        searchComponents: '',
        showPaginatorClick: true,
        searching: false,
        payload: this.payloadInit('component'),
        errorList: []
      }
    },
    /* Fetches liceses from the database and puts them in components */
    mounted () {
      this.getNext(false)
    },
    watch: {
      searchComponents: function (a) {
        if (a.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.components = []
          this.payload = this.payloadInit('component')
          this.getNext(true)
        } else if (a.length > 0) {
          this.searching = true
          let sort = this.payload.sort
          this.payload = this.payloadInit('component')
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
      /**
       * Add a product to the database according to the fields in the view
       */
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
      addProduct () {
        let data = {
          productName: this.productName,
          productVersion: this.productVersion,
          comment: this.productComment,
          components: this.checkedComponents
        }
        this.errorList = this.checkInput(this.productName, this.productVersion, this.checkedComponents)
        if (this.errorList.length === 0) {
          axios.post(this.$baseAPI + 'products/add', data)
            .then(response => {
              if (response.data === 'success') {
                this.productName = null
                this.productVersion = null
                this.productComment = null
                axios.get(this.$baseAPI + 'products')
                  .then(response => {
                    this.products = response.data
                  })
                this.$router.go()
              } else if (response.data === 'error') {
                this.errorList = []
                this.errorList[0] = 'A product with the name "' + this.productName + '" and version "' + this.productVersion + '" already exists.'
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
          errors[errors.length] = 'A component must be binded to the product'
        }
        return errors
      },

      // GET METHODS
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (replaceItemsList) {
        axios.get(this.$baseAPI + 'components/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.components = this.payload.items : this.components = this.components.concat(this.payload.items)
            this.components.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
          }).catch(err => console.log(err))
      },
      getNextSearchQuery (replaceItemsList) {
        if (this.components.length < this.payload.meta.count) {
          axios.get(this.$baseAPI + 'components/search/' + this.searchComponents + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
            .then(response => {
              this.payload = response.data
              replaceItemsList ? this.components = [...this.payload.items] : this.components = [...this.components, ...this.payload.items]
              if (this.components.length === this.payload.meta.count) {
                this.showPaginatorClick = null
              } else {
                this.showPaginatorClick = true
              }
            }).catch(err => console.log(err))
        } else {
          this.showPaginatorClick = null
        }
      },
      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchComponent (search) {
        const path = `components/search/${search}/${this.payload.links.next}` + this.payload.sort.column + this.payload.sort.order
        let _this = this
        axios.get(this.$baseAPI + path).then(response => {
          if (response.data != null) {
            _this.payload = response.data
            _this.components = [..._this.payload.items]
            if (_this.components.length === _this.payload.meta.count) {
              _this.showPaginatorClick = false
            }
          } else {
            _this.message = 'No component found!'
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  .product-list {
    margin-bottom: 30px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }

</style>
