<!-- View for showing information about a license -->
<template>
  <div class="section">
        <div v-if="license" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">License {{ license.id }}</h1>
          </div>

          <!-- Columns that is centered and multiline for support on lower resolution -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Column that contains the name and version of the license. Also contains
             the update button -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Name</label>
                <div class="control">
                  <input v-model="license.licenseName" class="input" type="text" readonly>
                </div>
              </div>

              <div class="field is-horizontal">
                <label class="field-label label is-normal">Version</label>
                <div class="control">
                  <input v-model="license.licenseVersion" class="input" type="text" readonly>
                </div>
              </div>
            </div>

            <!-- Column that contains the date the license was created, the license type
             and the URL for the license -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Created</label>
                <div class="control">
                  <input v-model="license.dateCreated" class="input" type="text"  readonly>
                </div>
              </div>
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Type</label>
                <div class="control">
                  <input v-model="license.licenseType" class="input" type="text" readonly>
                </div>
              </div>
              <div class="field is-horizontal">
                <label class="field-label label is-normal">URL</label>
                <div class="control">
                  <input v-if="license.URL" v-model="license.URL" class="input" type="text" readonly>
                  <input v-else v-model="testURL" class="input" type="text" readonly>
                </div>
              </div>
            </div>

            <!-- Column that contains the comment for the license -->
            <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea class="textarea" v-model="license.comment" readonly></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Columns that contains tables -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Table that shows which components this license is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Components with license</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="co in components">
                  <td scope="row" data-label="Component">{{ co.componentName }}</td>
                  <td scope="row" data-label="Version">{{ co.componentVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which products this license is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Products with license</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="produ in products">
                  <td scope="row" data-label="Product">{{ produ.productName }}</td>
                  <td scope="row" data-label="Version">{{ produ.productVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which projects this license is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Project with license</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="projec in projects">
                  <td scope="row" data-label="Project">{{ projec.projectName }}</td>
                  <td scope="row" data-label="Version">{{ projec.projectVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <!-- If no license is found -->
        <div v-else>
          <div class="columns">
            <div class="column is-3">
              <h1>License not found</h1>
              <p>No license with ID {{ id }}</p>
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
        license: {},
        components: [],
        products: [],
        projects: [],
        message: ''
      }
    },

    /* Fetch the license with id from database and add to license,
     * then fetch components, products and projects */
    mounted () {
      axios.get(this.$baseAPI + 'licenses/' + this.$route.params.id)
        .then(response => {
          this.license = response.data
          this.fetchComponents()
          this.fetchProducts()
          this.fetchProjects()
        })
    },

    methods: {
      /**
       * Fetch all components that contains this license
       */
      fetchComponents () {
        axios.get(this.$baseAPI + 'components/componentsWithLicense/' + this.$route.params.id).then(response => {
          this.components = response.data
        })
      },

      /**
       * Fetch all products that contains this license
       */
      fetchProducts () {
        axios.get(this.$baseAPI + 'products/productsWithLicense/' + this.$route.params.id).then(response => {
          this.products = response.data
        })
      },

      /**
       * Fetch all projects that contains this license
       */
      fetchProjects () {
        axios.get(this.$baseAPI + 'projects/projectsWithLicense/' + this.$route.params.id).then(response => {
          this.projects = response.data
        })
      }
    }
  }
</script>
