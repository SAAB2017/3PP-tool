<!-- View for adding Products -->
<template>
  <div class="component-list">
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
    <div class="vertical-menu" style="max-height: 200px; height: auto">
      <table>
        <thead>
        <tr>
          <td></td>
          <th>Component</th>
          <th>Version</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="component in components">
          <td style="text-align: center"><input class="checkbox" type="checkbox" v-bind:value=component.id v-model.number="checkedComponents"/></td>
          <td>{{ component.componentName }}</td>
          <td>{{ component.componentVersion }}</td>
        </tr>
        </tbody>
      </table>
    </div>
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

    <!-- Button for adding the product. Uses "addProduct"-function -->
    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProduct" class="button is-primary">Add product</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        components: [],
        checkedComponents: [],
        productName: '',
        productVersion: '',
        productComment: ''
      }
    },
    /* Fetches components from the database and puts them in components */
    mounted() {
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
            if (response.responseData.status === "success") {
              this.productName = ''
              this.productVersion = ''
              this.productComment = ''
              this.checkedLicenses = []
            }
          })
        this.$router.push({ name: 'products' })
      },

      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchComponent(){
        // TODO Implement method
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
