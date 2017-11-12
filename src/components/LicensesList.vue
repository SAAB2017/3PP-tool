<template>
  <div class="licenses-list">
    <div class="vertical-menu" style="max-height: 600px; min-width: 420px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th width="45%">License</th>
          <th width=15%>Version</th>
          <th width="20%">Created</th>
          <th width="20%">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="license in licenses" @click="displayComponent(license)">
          <td>{{ license.licenseName }}</td>
          <td>{{ license.licenseVersion }}</td>
          <td>{{ license.dateCreated }}</td>
          <td>{{ license.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchLicenses" class="input" type="text" placeholder="Find a license">
      </div>
      <div class="control">
        <a @click="searchLicense" class="button is-primary">Search</a>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        licenses: [],
        license: null,
        licenseVersion: null
      }
    },

    mounted() {
      axios.get(this.$baseAPI + 'licenses')
        .then(response => {
          this.licenses = response.data
        })
    },

    methods: {

      searchLicense(){
        // TODO Implement method
      },

      displayComponent(license) {
        this.$router.push({ name: "licenses_id", params: { id: license.id } })
      }
      /* TODO Should be able to delete this
      addComponent() {
        let data = {
          component: this.component,
          version: this.componentVersion
        }

        axios.post(this.$baseAPI + 'components', data)
          .then(response => {
            if (response.data === "success") {
              this.component = null
              this.componentVersion = null

              axios.get(this.$baseAPI + 'components')
                .then(response => {
                  this.components = response.data
                })
            }
          })
      } */
    }
  }
</script>

<style scoped>
  .licenses-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
  .vertical-menu {
    width: 100%;
    overflow-y: auto;
  }

</style>
