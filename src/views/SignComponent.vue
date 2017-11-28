<template>
  <div class="section">
    <div v-if="component" class="component">

      <div class="columns is-mobile is-centered">
        <div class="column is-half-desktop is-two-thirds-tablet is-full-mobile">

          <h2 class="subtitle is-4" style="text-align: center">{{ component.componentName }}</h2>

          <div class="columns is-mobile is-centered">
            <div class="field is-horizontal">
              <div class="control">
                <input v-model="component.approvedBy" class="input" type="text" placeholder="Signature">
              </div>
              <div class="control">
                <button @click="signComponent()" class="button is-primary">Sign</button>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Version</label>
            </div>
            <div class="field-body">
              <input v-model="component.componentVersion" class="input" type="text" disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Created</label>
            </div>
            <div class="field-body">
              <input v-model="component.dateCreated" class="input" type="text"  disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Comment</label>
            </div>
            <div class="field-body">
              <textarea class="textarea" v-model="component.comment" readonly></textarea>
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


          <!--p class="help is-success has-text-right subtitle is-6">Component status: {{ message }}</p-->

        </div>
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
      const pendingURI = 'components/' + this.$route.params.id
      axios.get(this.$baseAPI + pendingURI)
        .then(response => {
          this.component = response.data
          this.fetchLicenses()
        })
    },

    methods: {
      fetchLicenses () {
        axios.get(this.$baseAPI + 'licenses/licensesInComponent/' + this.$route.params.id).then(response => {
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
          axios.put(this.$baseAPI + 'components/approve', data)
            .then(response => {
              if (response.status === 204) {
                axios.get(this.$baseAPI + 'components/' + this.$route.params.id)
                  .then(response => {
                    console.log(response.data)
                    this.message = 'Component signed'
                    this.component = response.data[0]
                  })
              } else {
                console.log('Error: Could not sign component')
                this.message = 'Could not sign component'
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
