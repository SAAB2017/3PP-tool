<!-- View for showing all signed licenses -->
<template>
  <div class="licenses-list">
    <!-- Table that contains all signed licenses. Will grow to max-height and then
    become scrollable -->
    <!-- Field for searching for a license in the table. Uses "searchLicense"-method -->
    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchLicenses()" v-model="searchLicense" class="input" type="text" placeholder="Find a license">
      </div>
      <div class="control">
        <a @click="searchLicenses()" class="button is-primary">Search</a>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th scope="col">License</th>
          <th scope="col">Version</th>
          <th scope="col">Created</th>
          <th scope="col">Last edited</th>
        </tr>
      </thead>
      <tbody class="tbodyhome">
        <tr v-for="license in licenses" @click="displayComponent(license)">
          <td scope="row" data-label="License">{{ license.licenseName }}</td>
          <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
          <td scope="row" data-label="Created">{{ license.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ license.lastEdited }}</td>
        </tr>
      </tbody>
    </table>



    <div class="columns is-mobile is-centered">
      <licenses-add-modal></licenses-add-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import LicensesAddModal from '@/components/LicensesAddModal'

  export default {
    components: {
      LicensesAddModal
    },

    data() {
      return {
        licenses: [],
        license: null,
        licenseVersion: null,
        searchLicense: null
      }
    },

    /* Fetches signed licenses from the database and puts them in licenses */
    mounted() {
      this.getAllLicenses()
    },

    methods: {
      /**
       * Searches for licenses from the database matching the search-criteria
       */
      getAllLicenses () {
        axios.get(this.$baseAPI + 'licenses/')
          .then(response => {
            this.licenses = response.data
          })
      },

      searchLicenses () {
        if (this.searchLicense.length === 0) {
          this.getAllLicenses()
          return
        }
        if (this.searchLicense !== 0 || this.searchLicense !== null || this.searchLicense !== '') {
          axios.get(this.$baseAPI + 'licenses/search/' + this.searchLicense).then(response => {
            if (response.data != null) {
              this.licenses  = response.data
            } else {
              this.message = "No component found!"
            }
          })
        } else {
          this.getAllLicenses()
        }
      },

      /**
       * Opens the view for a specific license with id id.
       * @param license The license to be viewed
       */
      displayComponent(license) {
        this.$router.push({ name: "licenses_id", params: { id: license.id } })
      }
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
</style>
