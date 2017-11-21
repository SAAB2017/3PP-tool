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
    <div class="vertical-menu" style="max-height: 200px; height: auto">
      <table>
        <thead>
        <tr>
          <td></td>
          <th>License</th>
          <th>Version</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="license in licenses">
          <td style="text-align: center"><input class="checkbox" type="checkbox" v-bind:value=license.id v-model.number="checkedLicenses"></td>
          <td>{{ license.licenseName }}</td>
          <td>{{ license.licenseVersion }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- Field for searching for licenses. Uses "searchLicense"-method for searching -->
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchLicenses" class="input" type="text" placeholder="Find a license">
      </div>
      <div class="control">
        <a @click="searchLicense" class="button is-primary">Search</a>
      </div>
    </div>

    <!-- Textarea for adding a comment to the component -->
    <div class="field">
      <div class="control">
        <textarea v-model="componentComment" class="textarea" placeholder="Comment for component"></textarea>
      </div>
    </div>

    <!-- Button for adding the component. Uses "addComponent"-function -->
    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addComponent()" class="button is-primary">Add component</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        licenses: [],
        checkedLicenses: [],
        componentName: '',
        componentVersion: '',
        componentComment: ''
      }
    },
    /* Fetches liceses from the database and puts them in licenses */
    mounted () {
      axios.get(this.$baseAPI + 'licenses')
        .then(response => {
          this.licenses = response.data
        })
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
            }
          })
        this.$router.push({ name: 'components' })
      },

      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchLicense () {
        // TODO Implement method
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
  .vertical-menu {
    width: 100%;
    height: 150px;
    overflow-y: auto;
  }

</style>
