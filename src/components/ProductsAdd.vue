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
      </tbody>
    </table>
    <!-- Field for searching for components. Uses "searchComponent"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchComponents" class="input" type="text" placeholder="Find a component">
      </div>
      <div class="control">
        <a @click="searchComponent" class="button is-primary">Search</a>
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
        productComment: ''
      }
    },
    /* Fetches liceses from the database and puts them in components */
    mounted () {
      axios.get(this.$baseAPI + 'components')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {
      /**
       * Add a product to the database according to the fields in the view
       */
      addProduct () {
        let data = {
          productName: this.productName,
          productVersion: this.productVersion,
          comment: this.productComment,
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

      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchComponent () {
        // TODO Implement method
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
