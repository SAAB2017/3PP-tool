<template>
  <div class="section">
    <div v-if="component" class="component">
      <div class="columns is-mobile is-centered">
        <div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">
            <h2 class="subtitle is-4">{{ component.componentName }}</h2>
        </div>
      </div>

      <div class="columns is-mobile is-centered is-multiline">

        <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">

          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Version</label>
            <div class="control" style="width: 80%">
              <input v-if="component.componentVersion" v-model="component.componentVersion" class="input" type="text" disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Created</label>
            <div class="control" style="width: 80%">
              <input v-if="component.dateCreated" v-model="component.dateCreated" class="input" type="text"  disabled>
            </div>
          </div>

        </div>

        <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Comment</label>
            <div class="control" style="width: 80%">
              <textarea v-if="component.comment" class="textarea" v-model="component.comment"></textarea>
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
                  <tr v-for="license in licenses">
                    <td>{{ license.licenseName }}</td>
                    <td>{{ license.licenseVersion }}</td>
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
        <p class="help is-success has-text-right subtitle is-6">Component status: {{ message }}</p>
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
  export default {
    data () {
      return {
        component: {},
        licenses: [],
        license: {},
        message: ''
      }
    },

    mounted () {
      const pendingURI = 'components/' + JSON.stringify({id: this.$route.params.id})
      axios.get(this.$baseAPI + pendingURI)
        .then(response => {
          if (response.status === '404') {
            console.log("Error requesting data.")
          } else {
            this.component = response.data[0]
            this.message = ((this.component.approved === 0) ? 'Not signed' : 'Signed')
            this.fetchLicenses()
          }
        })
    },

    methods: {
      fetchLicenses() {
        axios.get(this.$baseAPI + 'licenses/licensesInComponent/' + JSON.stringify(this.$route.params.id)).then(response => {
          this.licenses = response.data
        })
      },
      signComponent () {
        if (this.component.approvedBy !== null || this.component.approvedBy) {
          console.log(this.component.componentName)
          let data = {
            id: this.component.id,
            approvedBy: this.component.approvedBy,
            comment: this.component.comment,
            lastEdited: new Date().toLocaleDateString()
          }
          console.log(JSON.stringify(data))
          console.log(this.$baseAPI + 'components/approve/' + JSON.stringify({id: this.$route.params.id}))
          axios.put(this.$baseAPI + 'components/approve', data)
            .then(response => {
              if (response.status === 204) {
                axios.get(this.$baseAPI + 'components/' + JSON.stringify({id: this.$route.params.id}))
                  .then(response => {
                    console.log(response.data)
                    this.message = 'Component signed'
                    this.component = response.data[0]
                  })
              } else {
                console.log("Error: Could not sign component")
                this.message = "Could not sign component"
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
