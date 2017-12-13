<!-- View for adding Components -->
<template>
  <div class="component-list">
    <div id="message-text">
      <p v-for="error in errorList" class="help is-danger subtitle is-6" style="text-align: center; padding-bottom: 2px">{{ error }}</p>
    </div>
    <!-- Fields for adding name and version to the component -->
    <div class="field" style="padding-top: 15px">
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
      <transition-group name="list" appear>
      <tr v-for="license in licenses" v-bind:key="license" class="list-item">
        <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=license.id v-model.number="checkedLicenses"></td>
        <td scope="row" data-label="License">{{ license.licenseName }}</td>
        <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
      </tr>
      </transition-group>
      <tr v-if="showPaginatorClick">
        <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Hämta in fler</a></div>
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
        searching: false,
        showPaginatorClick: true,
        payload: this.payloadFactory(),
        errorList: [],
        success: true
      }
    },
    /* Fetches liceses from the database and puts them in licenses */
    mounted () {
      this.payload = this.payloadFactory()
      this.getNextLicenses(true)
    },

    methods: {
      payloadFactory: payloadcfg.payloadInit.bind(null, 'license'),
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
        this.errorList = this.checkInput(this.componentName, this.componentVersion, this.checkedLicenses)
        if (this.errorList.length === 0) {
          axios.post(this.$baseAPI + 'components/add', data)
            .then(response => {
              if (response.data === 'success') {
                this.componentName = null
                this.componentVersion = null
                this.componentComment = null
                axios.get(this.$baseAPI + 'components ')
                  .then(response => {
                    this.components = response.data
                  })
                this.$router.go()
              } else if (response.data === 'error') {
                this.errorList = []
                this.errorList[0] = 'A component with the name "' + this.componentName + '" and version "' + this.componentVersion + '" already exists.'
              }
            })
        }
      },

      checkInput (name, version, checked) {
        let errors = []
        if (name === null || name.length === 0 || name === '') {
          errors[errors.length] = 'A name must be provided'
        }
        if (version === null || version.length === 0 || version === '') {
          errors[errors.length] = 'A version must be provided'
        }
        if (checked === null || checked.length === 0) {
          errors[errors.length] = 'A license must be binded to the component'
        }
        return errors
      },

      getAllLicenses () {
        axios.get(this.$baseAPI + 'licenses')
          .then(response => {
            this.licenses = response.data
          })
      },

      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNextLicenses(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },

      getNextLicenses (replaceItemList) {
        axios.get(this.$baseAPI + 'licenses/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemList ? this.licenses = [...this.payload.items] : this.licenses = [...this.licenses, ...this.payload.items]
            this.licenses.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
          })
      },

      getNextSearchQuery (replaceItemsList) {
        axios.get(this.$baseAPI + 'licenses/search/' + this.searchLicense + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.licenses = [...this.payload.items] : this.licenses = [...this.licenses, ...this.payload.items]
            if (this.licenses.length === this.payload.meta.count) {
              this.showPaginatorClick = null
            } else {
              this.showPaginatorClick = true
            }
          })
      },

      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchLicenses () {
        this.searching = true
        // create a new payload frame, with the old context data (so that we know "where" to get the next 25, 50 etc
        let sort = this.payload.sort
        this.payload = this.payloadFactory()
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchLicense.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.licenses = []
          this.getNextLicenses(true)
          return
        }
        if ((this.searchLicense.length !== 0) && (this.searchLicense !== null) && (this.searchLicense !== '')) {
          const path = `licenses/search/${this.searchLicense}/${this.payload.links.next}${this.payload.sort.column}${this.payload.sort.order}`
          axios.get(this.$baseAPI + path).then(response => {
            if (response.data != null) {
              this.payload = response.data
              this.licenses = [...this.payload.items]
            } else {
              this.message = 'No component found!'
            }
          })
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
