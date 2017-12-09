<!-- View for adding Products -->
<template>
  <div class="product-list">
    <!-- Fields for adding name and version to the product -->
    <div class="field">
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
      <tr v-for="component in components">
        <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=component.id v-model.number="checkedComponents"></td>
        <td scope="row" data-label="Component">{{ component.componentName }}</td>
        <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
      </tr>
      <tr v-if="showPaginatorClick">
        <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Hämta in fler</a></div>
      </tr>
      </tbody>
    </table>
    <!-- Field for searching for components. Uses "searchComponent"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchComponent()" v-model="searchComponents" class="input" type="text" placeholder="Find a component">
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
  import payloadcfg from '../../backend/routes/config'
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
        payload: this.payloadFactory()
      }
    },
    /* Fetches liceses from the database and puts them in components */
    mounted () {
      this.getNext(false)
    },

    methods: {
      /**
       * Add a product to the database according to the fields in the view
       */
      payloadFactory: payloadcfg.payloadInit.bind(null, 'component'),
      addProduct () {
        let data = {
          productName: this.productName,
          productVersion: this.productVersion,
          comment: this.productCommeznt,
          components: this.checkedComponents
        }

        axios.post(this.$baseAPI + 'products/add', data)
          .then(response => {
            if (response.responseData.status === 'success') {
              this.productName = null
              this.productVersion = null
              this.productComment = null
              axios.get(this.$baseAPI + 'products')
                .then(response => {
                  this.products = response.data
                })
            }
          })
        this.$router.go()
      },
      // GET METHODS
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          console.log('Searching query in textbox')
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (replaceItemsList) {
        axios.get(this.$baseAPI + 'components/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.components = [...this.payload.items] : this.components = [...this.components, ...this.payload.items]
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
      searchComponent () {
        this.searching = true
        let sort = this.payload.sort
        this.payload = this.payloadFactory()
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchComponents.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.components = []
          this.getNext(true)
          return
        }
        if ((this.searchComponents.length !== 0) && (this.searchComponents !== null) && (this.searchComponents !== '')) {
          const path = `components/search/${this.searchComponents}/${this.payload.links.next}${this.payload.sort.column}${this.payload.sort.order}`
          console.log(path)
          axios.get(this.$baseAPI + path).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.payload = response.data
              this.components = [...this.payload.items]
            } else {
              this.message = 'No component found!'
            }
          })
        }
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
