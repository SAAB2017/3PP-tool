<!-- View for showing all signed licenses -->
<template>
  <div class="licenses-list">
    <!-- Table that contains all signed licenses. Will grow to max-height and then
    become scrollable -->

    <div id="top-div-child" class="columns is-mobile is-centered" style="padding-top: 20px">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-on:keyup="searchLicense()" v-model="searchLicenses" class="input" type="text" placeholder="Find a product">
        </div>
        <div class="control">
          <button @click="searchLicense()" class="button is-primary">Search</button>
        </div>
      </div>
    </div>

    <div id="table-div">
      <table>
        <thead>
        <tr>
          <th scope="col">License</th>
          <th scope="col">Version</th>
          <th scope="col">Created</th>
          <th scope="col">Last edited</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="license in licenses" @click="displayComponent(license)">
          <td scope="row" data-label="License">{{ license.licenseName }}</td>
          <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
          <td scope="row" data-label="Created">{{ license.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ license.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
    </div>

   </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        licenses: [],
        license: null,
        licenseVersion: null,
        searchLicenses: null
      }
    },

    /* Fetches signed licenses from the database and puts them in licenses */
    mounted () {
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

      searchLicense () {
        if (this.searchLicenses.length === 0) {
          this.getAllLicenses()
          return
        }
        if (this.searchLicenses !== 0 || this.searchLicenses !== null || this.searchLicenses !== '') {
          axios.get(this.$baseAPI + 'licenses/search/' + this.searchLicenses).then(response => {
            if (response.data != null) {
              this.licenses = response.data
            } else {
              this.message = 'No component found!'
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
      displayComponent (license) {
        this.$router.push({ name: 'licenses_id', params: { id: license.id } })
      }
    }
  }
</script>

<style scoped>
  .table-fixed {
    padding-top: 110px;
  }

  .search-fixed {
    position: fixed;
    top: 110px;
  }

  .projects-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
