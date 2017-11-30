<!-- View for adding Projects -->
<template>
  <div class="project-list">
    <!-- Fields for adding name and version to the project -->
    <div class="field">
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
      <tr v-for="product in products">
        <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=product.id v-model.number="checkedProducts"></td>
        <td scope="row" data-label="Product">{{ product.productName }}</td>
        <td scope="row" data-label="Version">{{ product.productVersion }}</td>
      </tr>
      </tbody>
    </table>
    <!-- Field for searching for products. Uses "searchProduct"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchProduct()" v-model="searchProducts" class="input" type="text" placeholder="Find a product">
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
        searchProducts: ''
      }
    },
    /* Fetches liceses from the database and puts them in products */
    mounted () {
      this.getAllProducts()
    },

    methods: {
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

        axios.post(this.$baseAPI + 'projects/add', data)
          .then(response => {
            if (response.responseData.status === 'success') {
              this.projectName = null
              this.projectVersion = null
              this.projectComment = null
              axios.get(this.$baseAPI + 'projects')
                .then(response => {
                  this.projects = response.data
                })
            }
          })
        this.$router.go()
      },

      getAllProducts () {
        axios.get(this.$baseAPI + 'products')
          .then(response => {
            this.products = response.data
          })
      },

      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchProduct () {
        if (this.searchProducts.length === 0) {
          this.getAllProducts()
          return
        }
        if (this.searchProducts !== 0 || this.searchProducts !== null || this.searchProducts !== '') {
          axios.get(this.$baseAPI + 'products/search/' + this.searchProducts).then(response => {
            if (response.data !== null) {
              this.products = response.data
            } else {
              this.message = 'No product found!'
            }
          })
        } else {
          this.getAllProducts()
        }
      }
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
