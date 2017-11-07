<template>
  <div class="section">
    <div class="columns">
      <div class="columns is-3">
        <div v-if="project" class="project">
          <h1 class="has-text-right">Project {{ project.projectName }}</h1>
          <div class="field is-horizontal">
            <label class="label is-normal">Version: {{ project.projectVersion }}</label>
          </div>
          <div class="field is-horizontal">
            <label class="field-label label is-normal">Signature</label>
            <div class="control">
              <input v-model="project.approvedBy" class="input" type="text">
            </div>
          </div>

          <p class="help is-success has-text-right">{{ message }}</p>
          <div class="field is-grouped is-grouped-centered">
            <div class="control">
              <button @click="signProject()" class="button is-primary">Sign</button>
            </div>
          </div>

        </div>
        <div v-else>
          <h1>Project not found</h1>
          <p>No project with ID {{ id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  const pendingURI = 'projects/pending/'
  export default {

    data () {
      return {
        project: {},
        message: ''
      }
    },

    mounted () {
      axios.get(this.$baseAPI + pendingURI + this.$route.params.id)
        .then(response => {
          if (response.status === '404') {
            console.log("Error requesting data.")
          }
          this.project = response.data
        })
    },

    methods: {

      signProject () {
        if (this.project.approvedBy !== null || this.project.approvedBy) {
          console.log(this.project.projectName)
          let data = {
            id: this.project.id,
            approvedBy: this.project.approvedBy
          }
          axios.put(this.$baseAPI + 'projects/pending/' + this.project.id, data)
            .then(response => {
              if (response.status === '201') {
                axios.get(this.$baseAPI + 'projects/pending/' + this.project.id)
                  .then(response => {
                    this.message = 'Project signed'
                    this.project = response.data
                  })
              } else {
                console.log("Error: Could not sign project")
              }
            })
        } else {
          this.message = "Invalid signature!"
        }
      }
    }
  }
</script>
