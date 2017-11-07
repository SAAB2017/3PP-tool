<template>
  <div class="section">
        <div v-if="license" class="component">
          <h1 class="has-text-left">License {{ license.id }}</h1>
          <div class="columns">
            <div class="column is-12">
              <div class="columns">


                <div class="column is-3">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Name</label>
                    <div class="control">
                      <input v-if="license.licenseName" v-model="license.licenseName" class="input" type="text">
                      <input v-else class="input" type="text" v-model="testName">
                    </div>
                  </div>

                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Version</label>
                    <div class="control">
                      <input v-if="license.licenseVersion" v-model="license.licenseVersion" class="input" type="text">
                      <input v-else v-model="testVersion" class="input" type="text" >
                    </div>
                  </div>
                </div>


                <div class="column is-3">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Created</label>
                    <div class="control">
                      <input v-if="license.dateCreated" v-model="license.dateCreated" class="input" type="text"  disabled>
                      <input v-else  v-model="testDate" class="input" type="text" disabled>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Type</label>
                    <div class="control">
                      <input v-if="license.licenseType" v-model="license.licenseType" class="input" type="text" disabled>
                      <input v-else v-model="testType" class="input" type="text" disabled>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">URL</label>
                    <div class="control">
                      <input v-if="license.URL" v-model="license.URL" class="input" type="text" disabled>
                      <input v-else v-model="testURL" class="input" type="text" disabled>
                    </div>
                  </div>
                </div>

                <div class="column">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Comment</label>
                    <div class="control" style="width: 100%">
                      <textarea v-if="license.comment" class="textarea" v-model="license.comment"></textarea>
                      <textarea v-else class="textarea" v-model="testComment"></textarea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="columns">
            <div class="column is-one-third">
              <!-- TODO Fix for-loops -->
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>License in components</th>
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
                  <th>License in products</th>
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
                  <th>License in projects</th>
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
        message: '',
        testName: 'Test name',
        testVersion: 'Test version',
        testDate: '2017-10-04',
        testType: 'Test type',
        testURL: 'https://www.google.com',
        testComment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      }
    },

    mounted () {
      axios.get(this.$baseAPI + 'licenses/' + this.$route.params.id)
        .then(response => {
          this.license = response.data
        })
    }
  }
</script>
