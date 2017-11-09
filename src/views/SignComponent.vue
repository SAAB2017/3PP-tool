<template>
  <div class="section">
    <div v-if="component" class="component">
      <div class="columns is-mobile is-centered">
        <div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">
            <h1 class="title is-2">Component {{ component.componentName }}</h1>
            <h2 class="subtitle is-4">Component name here</h2>
        </div>
      </div>

      <div class="columns is-mobile is-centered is-multiline">

        <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">

          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Version</label>
            <div class="control" style="width: 80%">
              <input v-if="component.componentVersion" v-model="component.componentVersion" class="input" type="text" disabled>
              <input v-else v-model="testVersion" class="input" type="text" disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Created</label>
            <div class="control" style="width: 80%">
              <input v-if="component.dateCreated" v-model="component.dateCreated" class="input" type="text"  disabled>
              <input v-else  v-model="testDate"class="input" type="text" disabled>
            </div>
          </div>

        </div>

        <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Comment</label>
            <div class="control" style="width: 80%">
              <textarea v-if="component.comment" class="textarea" v-model="component.comment"></textarea>
              <textarea v-else class="textarea" v-model="testComment"></textarea>
            </div>
          </div>



        </div>

        <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">

            <div class="field is-horizontal">
              <div class="vertical-menu" style="max-height: 200px">
                <table class="table is-bordered">
                  <thead>
                  <tr>
                    <th>Licenses</th>
                    <th width=1%>Version</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr> <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr> <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>


                  </tbody>
                </table>
              </div>
            </div>


        </div>




      </div>
      <div class="columns is-mobile is-centered is-gapless">

        <div class="column is-one-third-desktop is-half-tablet is-10-mobile">
          <div class="field is-horizontal">
            <label class="field-label label is-normal">Signature</label>
            <div class="control">
              <input v-model="component.approvedBy" class="input" type="text">
            </div>
            <div class="control">
              <button @click="signComponent()" class="button is-primary">Sign</button>
            </div>
          </div>
        </div>

      </div>

      <div class="columns is-mobile is-centered">
        <p class="help is-success has-text-right subtitle is-6">{{ message }}</p>
      </div>


    </div>
    <div v-else>
      <h1>Component not found</h1>
      <p>No component with ID {{ id }}</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  const pendingURI = 'components/pending/'
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
      axios.get(this.$baseAPI + pendingURI + this.$route.params.id)
        .then(response => {
          if (response.status === '404') {
            console.log("Error requesting data.")
          }
          this.component = response.data
        })
    },

    methods: {

      signComponent () {
        if (this.component.approvedBy !== null || this.component.approvedBy) {
          console.log(this.component.componentName)
          let data = {
            id: this.component.id,
            approvedBy: this.component.approvedBy
          }
          axios.put(this.$baseAPI + 'components/pending/' + this.component.id, data)
            .then(response => {
              if (response.status === '201') {
                axios.get(this.$baseAPI + 'components/pending/' + this.component.id)
                  .then(response => {
                    this.message = 'Component signed'
                    this.component = response.data
                  })
              } else {
                console.log("Error: Could not sign component")
              }
            })
        } else {
          this.message = "Invalid signature!"
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
