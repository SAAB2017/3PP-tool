<template>
  <div class="section">
        <div v-if="component" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">Component {{ component.id }}</h1>
          </div>

          <div class="columns is-mobile is-centered is-multiline">

            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Name</label>
                <div class="control">
                  <input v-if="component.componentName" v-model="component.componentName" class="input" type="text">
                </div>
              </div>

              <div class="field is-horizontal">
                <label class="field-label label is-normal">Version</label>
                <div class="control">
                  <input v-if="component.componentVersion" v-model="component.componentVersion" class="input" type="text">
                </div>
              </div>
              <p class="help is-success has-text-right">{{ message }}</p>

              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button @click="updateComponent()" class="button is-primary">Update</button>
                </div>
              </div>
            </div>

            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Created</label>
                <div class="control">
                  <input v-if="component.dateCreated" v-model="component.dateCreated" class="input" type="text"  disabled>
                </div>
              </div>
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Approver</label>
                <div class="control">
                  <input v-if="component.approvedBy" v-model="component.approvedBy" class="input" type="text" disabled>
                </div>
              </div>
            </div>

            <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea v-if="component.comment" class="textarea" v-model="component.comment"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="columns is-mobile is-centered is-multiline">

            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Licenses in component</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="license in licenses">
                  <td> {{ license.licenseName }}</td>
                  <td>{{ license.licenseVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Component in products</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Test Name</td>
                  <td>1.0</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Component in projects</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Test Name</td>
                  <td>1.0</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <div v-else>
          <div class="columns">
            <div class="column is-3">
              <h1>Component not found</h1>
              <p>No component with ID {{ id }}</p>
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
        component: {},
        licenses: [],
        message: ''
      }
    },

    mounted () {
      const cURI = JSON.stringify({id: this.$route.params.id});
      axios.get(this.$baseAPI + 'components/' + cURI)
        .then(response => {
          this.component = response.data[0]
          this.fetchLicenses()
        })
    },

    methods: {
      fetchLicenses () {
        axios.get(this.$baseAPI + 'licenses/licensesInComponent/' + JSON.stringify(this.$route.params.id)).then(response => {
          this.licenses = response.data
        })
      },

      fetchProducts() {

      },
      updateComponent () {
        var data = {
          id: this.component.id,
          component: this.component,
          version: this.component.version,
          comment: this.component.comment
        }

        axios.put(this.$baseAPI + 'components/' + this.component.id, data)
          .then(response => {
            if (response.status === '201') {
              axios.get(this.$baseAPI + 'components/' + this.component.id)
                .then(response => {
                  this.message = 'Update sucessful'
                  this.component = response.data
                })
            }
          })
      },

      deleteComponent () {
        axios.delete(this.$baseAPI + 'components/' + this.component.id)
          .then(response => {
            if (response.status === '200') {
              this.$router.push({ name: 'components' })
            }
          })
      }
    }
  }
</script>
