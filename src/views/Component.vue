<template>
  <div class="section">
        <div v-if="component" class="component">
          <h1 class="has-text-left">Component {{ component.id }}</h1>
          <div class="columns">
            <div class="column is-12">
              <div class="columns">


                <div class="column is-3">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Name</label>
                    <div class="control">
                      <input v-if="component.componentName" v-model="component.componentName" class="input" type="text">
                      <input v-else class="input" type="text" v-model="testName">
                    </div>
                  </div>

                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Version</label>
                    <div class="control">
                      <input v-if="component.componentVersion" v-model="component.componentVersion" class="input" type="text">
                      <input v-else v-model="testVersion" class="input" type="text" >
                    </div>
                  </div>
                  <p class="help is-success has-text-right">{{ message }}</p>

                  <div class="field is-grouped is-grouped-right">
                    <div class="control">
                      <button @click="updateComponent()" class="button is-primary">Update</button>
                    </div>
                  </div>
                </div>


                <div class="column is-3">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Created</label><label style="color: transparent">h</label>
                    <div class="control">
                      <input v-if="component.dateCreated" v-model="component.dateCreated" class="input" type="text"  disabled>
                      <input v-else  v-model="testDate"class="input" type="text" disabled>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Approver</label>
                    <div class="control">
                      <input v-if="component.approvedBy" v-model="component.approvedBy" class="input" type="text" disabled>
                      <input v-else v-model="testApproved" class="input" type="text" disabled>
                    </div>
                  </div>
                </div>

                <div class="column">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Comment</label>
                    <div class="control" style="width: 100%">
                      <textarea v-if="component.comment" class="textarea" v-model="component.comment"></textarea>
                      <textarea v-else class="textarea" v-model="testComment"></textarea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="columns">
            <div class="column is-one-third">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Licenses in component</th>
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
            <div class="column is-one-third">
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
            <div class="column is-one-third">
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
        message: '',
        testName: 'Test name',
        testVersion: 'Test version',
        testDate: '2017-10-04',
        testApproved: 'Nils Nilsson',
        testComment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      }
    },

    mounted () {
      axios.get(this.$baseAPI + 'components/' + this.$route.params.id)
        .then(response => {
          this.component = response.data
        })
    },

    methods: {

      updateComponent () {
        var data = {
          id: this.component.id,
          component: this.component.component,
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
              this.$router.push({ name: 'Components' })
            }
          })
      }
    }
  }
</script>
