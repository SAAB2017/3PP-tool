<template>
  <div class="section">
    <div v-if="project" class="project">

      <div class="columns is-mobile is-centered">
        <div class="column is-half-desktop is-two-thirds-tablet is-full-mobile">

          <h2 class="subtitle is-4" style="text-align: center">{{ project.projectName }}</h2>

          <p class="help is-danger subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>

          <div class="columns is-mobile is-centered">
            <div class="field is-horizontal">
              <div class="control">
                <input v-model="project.approvedBy" class="input" type="text" placeholder="Signature">
              </div>
              <div class="control">
                <button @click="signProject()" class="button is-primary">Sign</button>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Version</label>
            </div>
            <div class="field-body">
              <input v-model="project.projectVersion" class="input" type="text" disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Created</label>
            </div>
            <div class="field-body">
              <input v-model="project.dateCreated" class="input" type="text"  disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Comment</label>
            </div>
            <div class="field-body">
              <textarea class="textarea" v-model="project.comment" readonly></textarea>
            </div>
          </div>

          <table class="table is-bordered">
            <thead>
            <tr>
              <th scope="col">Licenses</th>
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
      </div>

    </div>
    <div v-else>
      <h1>Project not found</h1>
      <p>No project with ID {{ id }}</p>
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
        license: {},
        message: ''
      }
    },

    mounted () {
      const pendingURI = 'projects/' + this.$route.params.id
      axios.get(this.$baseAPI + pendingURI)
        .then(response => {
          this.project = response.data
          this.fetchLicenses()
        })
    },

    methods: {
      fetchLicenses () {
        axios.get(this.$baseAPI + 'licenses/licensesInProject/' + this.$route.params.id).then(response => {
          this.licenses = response.data
        })
      },

      /**
       * Approves the project and adds the approvers signature to the project
       */
      signProject () {
        if (this.project.approvedBy !== '' || this.project.approvedBy.length !== 0) {
          let data = {
            id: this.project.id,
            approvedBy: this.project.approvedBy,
            comment: this.project.comment,
            lastEdited: new Date().toLocaleDateString()
          }
          axios.put(this.$baseAPI + 'projects/approve', data)
            .then(response => {
              if (response.status === 204) {
                this.$router.push({name: 'projects', params: {type: 'signed', sName: this.project.projectName, sVersion: this.project.projectVersion}})
              } else {
                this.message = response.data
              }
            })
            .catch(error => {
              if (error.response) {
                if (error.response.status === 500) {
                  this.message = 'Already signed by ' + error.response.data.byUser
                }
              }
            })
        } else {
          this.message = 'Invalid signature!'
        }
      }
    }
  }
</script>

<style>

  tbody>tr:hover {
    cursor: pointer;
  }

  .vertical-menu {
    width: 100%;
    overflow-y: auto;
  }
</style>
