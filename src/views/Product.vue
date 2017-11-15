<!-- View for showing information about and updating a product -->
<template>
  <div class="section">
        <div v-if="product" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">Product {{ product.id }}</h1>
          </div>

          <!-- Columns that is centered and multiline for support on lower resolution -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Column that contains the name and version of the product. Also contains
             the update button -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Name</label>
                <div class="control">
                  <input v-model="product.productName" class="input" type="text">
                </div>
              </div>

              <div class="field is-horizontal">
                <label class="field-label label is-normal">Version</label>
                <div class="control">
                  <input v-model="product.productVersion" class="input" type="text">
                </div>
              </div>
              <p class="help is-success has-text-right">{{ message }}</p>
              <!-- Button for updating the product values. Uses "updateProduct"-function -->
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button @click="updateProduct()" class="button is-primary">Update</button>
                </div>
              </div>
            </div>

            <!-- Column that contains the date the product was created and the signature
            for the person that approved it -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Created</label>
                <div class="control">
                  <input v-model="product.dateCreated" class="input" type="text"  readonly>
                </div>
              </div>
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Approver</label>
                <div class="control">
                  <input v-model="product.approvedBy" class="input" type="text" readonly>
                </div>
              </div>
            </div>

            <!-- Column that contains the comment for the product -->
            <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea class="textarea" v-model="product.comment"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Columns that contains tables -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Table that shows which licenses is in this product -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Licenses in product</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="license in licenses">
                  <td scope="row" data-label="License">{{ license.licenseName }}</td>
                  <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which components is in this product -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Components in product</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="component in components">
                  <td scope="row" data-label="Component">{{ component.componentName }}</td>
                  <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which projects this product is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Product in projects</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="project in projects">
                  <td scope="row" data-label="Project">{{ project.projectName }}</td>
                  <td scope="row" data-label="Version">{{ project.projectVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- If no product with id id is found -->
        <div v-else>
          <div class="columns">
            <div class="column is-3">
              <h1>Product not found</h1>
              <p>No product with ID {{ id }}</p>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {

    data () {
      return {
        product: {},
        licenses: [],
        components: [],
        projects: [],
        message: ''
      }
    },

    /* Fetch the product with id from database and add to product,
     * then fetch licenses, components and projects
     */
    mounted () {
      const pURI = JSON.stringify({id: this.$route.params.id});
      axios.get(this.$baseAPI + 'products/' + pURI)
        .then(response => {
          this.product = response.data[0]
          this.fetchLicenses()
          this.fetchComponents()
          this.fetchProjects()
        })
    },

    methods: {
      /**
       * Fetch all licenses that is in this product
       */
      fetchLicenses(){
        // TODO Implement
      },

      /**
       * Fetch all components that is in this product
       */
      fetchComponents(){
        // TODO Implement
      },

      /**
       * Fetch all projects that contains this product
       */
      fetchProjects(){
        // TODO Implement
      },
      /**
       * Update this product with new values
       */
      updateProduct () {
        var data = {
          id: this.product.id,
          product: this.product,
          version: this.product.version,
          comment: this.product.comment
        }

        axios.put(this.$baseAPI + 'products/' + this.product.id, data)
          .then(response => {
            if (response.status === '201') {
              axios.get(this.$baseAPI + 'product/' + this.product.id)
                .then(response => {
                  this.message = 'Update sucessful'
                  this.product = response.data
                })
            }
          })
      }
    }
  }
</script>
