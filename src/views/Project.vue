<template>
  <div class="section">
        <div v-if="project" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">Project {{ project.id }}</h1>
          </div>

          <div class="columns is-mobile is-centered is-multiline">


            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Name</label>
                <div class="control">
                  <input v-if="project.projectName" v-model="project.projectName" class="input" type="text">
                  <input v-else class="input" type="text" v-model="testName">
                </div>
              </div>

              <div class="field is-horizontal">
                <label class="field-label label is-normal">Version</label>
                <div class="control">
                  <input v-if="project.projectVersion" v-model="project.projectVersion" class="input" type="text">
                  <input v-else v-model="testVersion" class="input" type="text" >
                </div>
              </div>
              <p class="help is-success has-text-right">{{ message }}</p>

              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button @click="updateProject()" class="button is-primary">Update</button>
                </div>
              </div>
            </div>


            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Created</label>
                <div class="control">
                  <input v-if="project.dateCreated" v-model="project.dateCreated" class="input" type="text"  disabled>
                  <input v-else  v-model="testDate"class="input" type="text" disabled>
                </div>
              </div>
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Approver</label>
                <div class="control">
                  <input v-if="project.approvedBy" v-model="project.approvedBy" class="input" type="text" disabled>
                  <input v-else v-model="testApproved" class="input" type="text" disabled>
                </div>
              </div>
            </div>

            <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea v-if="project.comment" class="textarea" v-model="project.comment"></textarea>
                  <textarea v-else class="textarea" v-model="testComment"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="columns is-mobile is-centered is-multiline">

            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <!-- TODO Fix for-loops -->
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Licenses in project</th>
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
                  <th>Components in project</th>
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
                  <th>Products in project</th>
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
              <h1>Project not found</h1>
              <p>No project with ID {{ id }}</p>
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
        message: '',
        testName: 'Test name',
        testVersion: 'Test version',
        testDate: '2017-10-04',
        testApproved: 'Nils Nilsson',
        testComment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      }
    },

    mounted () {
      axios.get(this.$baseAPI + 'projects/' + this.$route.params.id)
        .then(response => {
          this.project = response.data
        })
    },

    methods: {

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
