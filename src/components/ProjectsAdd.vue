<!-- View for adding Projects -->
<template>
  <div class="component-list">
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
    <div class="vertical-menu" style="max-height: 200px; height: auto">
      <table>
        <thead>
        <tr>
          <td></td>
          <th>Project</th>
          <th>Version</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products">
          <td style="text-align: center"><input class="checkbox" type="checkbox" v-bind:value=product.id v-model.number="checkedProducts"></td>
          <td>{{ product.productName }}</td>
          <td>{{ product.productVersion }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- Field for searching for products. Uses "searchProduct"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchProducts" class="input" type="text" placeholder="Find a product">
      </div>
      <div class="control">
        <a @click="searchProduct" class="button is-primary">Search</a>
      </div>
    </div>

    <!-- Textarea for adding a comment to the project -->
    <div class="field">
      <div class="control">
        <textarea v-model="projectComment" class="textarea" placeholder="Comment for project"></textarea>
      </div>
    </div>

    <!-- Button for adding the project. Uses "addProject"-function -->
    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProject()" class="button is-primary">Add project</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        products: [],
        checkedProducts: [],
        projectName: '',
        projectVersion: '',
        projectComment: ''
      }
    },
    /* Fetches products from the database and puts them in products */
    mounted() {
      axios.get(this.$baseAPI + 'products')
        .then(response => {
          this.products = response.data
        })
    },

    methods: {
      /**
       * Add a project to the database according to the fields in the view
       */
      addProject() {
        let data = {
          projectName: this.projectName,
          projectVersion: this.projectVersion,
          comment: this.projectComment,
          products: this.checkedProducts
        }

        axios.post(this.$baseAPI + 'projects/add', data)
          .then(response => {
            if (response.responseData.status === "success") {
              this.projectName = ''
              this.projectVersion = ''
              this.projectComment = ''
              this.checkedProducts = []
            }
          })
        this.$router.push({ name: 'projects' })
      },

      /**
       * Searches for products from the database matching the search-criteria
       */
      searchProduct(){
        // TODO implement method
      }
    }
  }
</script>

<style scoped>
  .component-list {
    margin-bottom: 30px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
  .vertical-menu {
    width: 100%;
    height: 150px;
    overflow-y: auto;
  }

</style>
