<!-- View for showing information about and updating a project -->
<template>
  <div class="section">
        <div v-if="project" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">Project {{ project.id }}</h1>
          </div>

          <!-- Columns that is centered and multiline for support on lower resolution -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Column that contains the name and version of the project. Also contains
             the update button -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Name</label>
                <div class="control">
                  <input v-model="project.projectName" class="input" type="text">
                </div>
              </div>

              <div class="field is-horizontal">
                <label class="field-label label is-normal">Version</label>
                <div class="control">
                  <input v-model="project.projectVersion" class="input" type="text">
                </div>
              </div>
              <p class="help is-success has-text-right">{{ message }}</p>
              <!-- Button for updating the project values. Uses "updateProject"-function -->
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button @click="updateProject()" class="button is-primary">Update</button>
                </div>
              </div>
            </div>

            <!-- Column that contains the date the product was created and the signature
             for the person that approved it -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Created</label>
                <div class="control">
                  <input v-model="project.dateCreated" class="input" type="text"  readonly>
                </div>
              </div>
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Approver</label>
                <div class="control">
                  <input v-model="project.approvedBy" class="input" type="text" readonly>
                </div>
              </div>
            </div>

            <!-- Column that contains the comment for the product -->
            <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea class="textarea" v-model="project.comment"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Columns that contains tables -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Table that shows which licenses is in this project -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Licenses in project</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="license in licenses">
                  <td>{{ license.licenseName }}</td>
                  <td>{{ license.licenseVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which components is in this project -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Components in project</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="component in components">
                  <td>{{ component.componentName }}</td>
                  <td>{{ component.componentVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which products is in this project -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Products in project</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in products">
                  <td>{{ product.productName }}</td>
                  <td>{{ product.productVersion }}</td>
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
              <h1>Project not found</h1>
              <p>No project with ID {{ id }}</p>
              <p>{{ message }}</p>
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
        project: {},
        licenses: [],
        components: [],
        projects: [],
        message: ''
      }
    },

    mounted () {
      const pURI = JSON.stringify({id: this.$route.params.id});
      axios.get(this.$baseAPI + 'projects/' + pURI)
        .then(response => {
          this.project = response.data[0]
          this.message = response.message
          this.fetchLicenses()
          this.fetchComponents()
          this.fetchProducts()
        })
    },

    methods: {
      /**
       * Fetch all licenses that is in this project
       */
      fetchLicenses(){
        // TODO Implement
      },

      /**
       * Fetch all components that is in this project
       */
      fetchComponents(){
        // TODO Implement
      },

      /**
       * Fetch all products that is in this project
       */
      fetchProducts(){
        // TODO Implement
      },

      /**
       * Update this product with new values
       */
      updateProject () {
        var data = {
          id: this.project.id,
          component: this.project.component,
          version: this.project.version,
          comment: this.project.comment
        }

        axios.put(this.$baseAPI + 'projects/' + this.project.id, data)
          .then(response => {
            if (response.status === '201') {
              axios.get(this.$baseAPI + 'project/' + this.project.id)
                .then(response => {
                  this.message = 'Update sucessful'
                  this.project = response.data
                })
            }
          })
      }
    }
  }
</script>
