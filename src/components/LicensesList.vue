<!-- View for showing all signed licenses -->
<template>
  <div class="licenses-list">
    <!-- Table that contains all signed licenses. Will grow to max-height and then
    become scrollable -->
    <div class="vertical-menu" style="max-height: 450px; min-width: 420px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th width="45%">License</th>
          <th width="15%">Version</th>
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

    <!-- Field for searching for a license in the table. Uses "searchLicense"-method -->
    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchLicenses" class="input" type="text" placeholder="Find a license">
      </div>
      <div class="control">
        <a @click="searchLicense()" class="button is-primary">Search</a>
      </div>
    </div>

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
        licenseVersion: null
      }
    },

    /* Fetches signed licenses from the database and puts them in licenses */
    mounted() {
      axios.get(this.$baseAPI + 'licenses')
        .then(response => {
          this.licenses = response.data
        })
    },

    methods: {
      /**
       * Searches for licenses from the database matching the search-criteria
       */
      searchLicense(){
        // TODO Implement method
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
  .vertical-menu {
    width: 100%;
    overflow-y: auto;
  }
</style>
