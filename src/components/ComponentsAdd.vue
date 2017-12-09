<!-- View for adding Components -->
<template>
  <div class="component-list">
    <!-- Fields for adding name and version to the component -->
    <div class="field">
      <p class="control">
        <input v-model="componentName" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="componentVersion" class="input" type="text" placeholder="Version">
      </p>
    </div>

    <!-- Table for picking licenses to bind to the component. Shows all approved
    licenses but becomes scrollable after reaching max-size (because of class="vertical-menu") -->
    <table>
      <thead>
      <tr>
        <td style="width: 25px"></td>
        <th scope="col">License</th>
        <th scope="col">Version</th>
      </tr>
      </thead>
      <tbody class="tbodyadd">
      <tr v-for="license in licenses">
        <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=license.id v-model.number="checkedLicenses"></td>
        <td scope="row" data-label="License">{{ license.licenseName }}</td>
        <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
      </tr>
      <tr v-if="showPaginatorClick">
        <div id="paginator" style="text-align: center;" @click="getMore()"><a class="button is-primary">Hämta in fler</a></div>
      </tr>
      </tbody>
    </table>
    <!-- Field for searching for licenses. Uses "searchLicense"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchLicenses()" v-model="searchLicense" class="input" type="text" placeholder="Find a license">
      </div>
      <div class="control">
        <a @click="searchLicenses()" class="button is-primary">Search</a>
      </div>
    </div>

    <!-- Textarea for adding a comment to the component -->
    <div class="field">
      <div class="control">
        <textarea v-model="componentComment" class="textarea" placeholder="Comment for component"></textarea>
      </div>
    </div>

    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addComponent()" class="button is-primary">Add Component</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import payloadcfg from '../../backend/routes/config'
  export default {

    data () {
      return {
        licenses: [],
        checkedLicenses: [],
        componentName: '',
        componentVersion: '',
        componentComment: '',
        searchLicense: '',
        showPaginatorClick: true
      }
    },
    /* Fetches liceses from the database and puts them in licenses */
    mounted () {
      this.getAllLicenses()
    },

    methods: {
      /**
       * Add a component to the database according to the fields in the view
       */
      addComponent () {
        let data = {
          componentName: this.componentName,
          componentVersion: this.componentVersion,
          comment: this.componentComment,
          licenses: this.checkedLicenses
        }

        axios.post(this.$baseAPI + 'components/add', data)
          .then(response => {
            if (response.responseData.status === 'success') {
              this.componentName = null
              this.componentVersion = null
              this.componentComment = null
              axios.get(this.$baseAPI + 'components ')
                .then(response => {
                  this.components = response.data
                })
            }
          })
        this.$router.go()
      },

      getAllLicenses () {
        axios.get(this.$baseAPI + 'licenses')
          .then(response => {
            this.licenses = response.data
          })
      },
      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchLicenses () {
        if (this.searchLicense.length === 0) {
          this.getAllLicenses()
          return
        }
        if (this.searchLicense !== 0 || this.searchLicense !== null || this.searchLicense !== '') {
          axios.get(this.$baseAPI + 'licenses/search/' + this.searchLicense).then(response => {
            if (response.data !== null) {
              this.licenses = response.data
            } else {
              this.message = 'No component found!'
            }
          })
        } else {
          this.getAllLicenses()
        }
      }
    }
  }
</script>

<style scoped>
  .component-list {
    margin-bottom: 30px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }

</style>
