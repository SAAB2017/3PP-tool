<style>
  .license-fade-enter-active, .license-fade-leave-active {
    transition: opacity .127s ease;
  }
  .license-fade-enter, .license-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .list-enter-active, .list-leave-active {
    transition: all 0.327s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<!-- View for showing all signed licenses -->
<template>
  <div class="licenses-list">
    <!-- Table that contains all signed licenses. Will grow to max-height and then
    become scrollable -->

    <div id="top-div-child" class="columns is-mobile is-centered" style="padding-top: 20px">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-model="searchLicenses" class="input" type="text" placeholder="Find a product">
        </div>
        <div class="control">
          <button @click="searchLicense()" class="button is-primary">Search</button>
        </div>
      </div>
    </div>

    <div id="table-div">
      <table>
        <thead>
        <tr style="background-color: white">
          <th scope="col" @click="sortName()">License</th>
          <th scope="col" @click="sortVersion()">Version</th>
          <th scope="col" @click="sortCreated()">Created</th>
          <th scope="col" @click="sortEdited()">Last edited</th>
        </tr>
      </thead>
      <tbody>
      <transition-group name="list" appear>
        <tr v-for="license in licenses" @click="displayComponent(license)" v-bind:key="license" class="list-item">
          <td scope="row" data-label="License">{{ license.licenseName }}</td>
          <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
          <td scope="row" data-label="Created">{{ license.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ license.lastEdited }}</td>
        </tr>
      </transition-group>
      <tr v-if="showPaginatorClick">
        <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Get more</a></div>
      </tr>
      </tbody>
      </table>
    </div>

   </div>
</template>

<script>
  import axios from 'axios'
  import * as payloadcfg from '../../backend/routes/config'

  export default {
    data () {
      return {
        licenses: [],
        license: null,
        licenseVersion: null,
        searchLicenses: null,
        sorted: '',
        ordering: 'asc',
        message: '',
        showPaginatorClick: true,
        searching: false,
        payload: this.payloadFactory()
      }
    },

    /* Fetches signed licenses from the database and puts them in licenses */
    mounted () {
      this.getNext(true)
    },

    watch: {
      searchLicenses: function (a) {
        if (a.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.licenses = []
          this.payload = this.payloadFactory()
          this.getNext(true)
        } else if (a.length > 0) {
          this.searching = true
          let sort = this.payload.sort
          this.payload = this.payloadFactory()
          this.payload.sort = sort
          this.searchLicense(a)
        }
      },
      ordering: function (newval) {
        this.licenses = []
      },
      licenses: function (a) {
        if (a.length === this.payload.meta.count) {
          this.showPaginatorClick = false
        } else if (a.length < this.payload.meta.count) {
          this.showPaginatorClick = true
        }
      }
    },

    methods: {

      /**
       * Function that creates a default payload
       */
      payloadFactory: payloadcfg.payloadInit.bind(null, 'license'),
      /**
       * Searches for licenses from the database matching the search-criteria
       */
      getAllLicenses () {
        axios.get(this.$baseAPI + 'licenses/')
          .then(response => {
            this.licenses = response.data
          })
      },

      // GET METHODS
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (replaceItemsList) {
        axios.get(this.$baseAPI + 'licenses/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.licenses = this.payload.items : this.licenses = this.licenses.concat(this.payload.items)
            this.licenses.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
          })
      },
      getNextSearchQuery (replaceItemsList) {
        axios.get(this.$baseAPI + 'licenses/search/' + this.searchLicenses + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.licenses = this.payload.items : this.licenses = this.licenses.concat(this.payload.items)
            if (this.licenses.length === this.payload.meta.count) {
              this.showPaginatorClick = null
            } else {
              this.showPaginatorClick = true
            }
          })
      },
      searchLicense () {
        this.searching = true
        // create a new payload frame, with the old context data (so that we know "where" to get the next 25, 50 etc
        let sort = this.payload.sort
        this.payload = this.payloadFactory()
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchLicenses.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.licenses = []
          this.getNext(true)
          return
        }
        if ((this.searchLicenses.length !== 0) && (this.searchLicenses !== null) && (this.searchLicenses !== '')) {
          const path = 'licenses/search/' + this.searchLicenses + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
          axios.get(this.$baseAPI + path).then(response => {
            if (response.data != null) {
              this.payload = response.data
              this.licenses = this.payload.items
            } else {
              this.message = 'No component found!'
            }
          })
        }
      },

      /**
       * Opens the view for a specific license with id id.
       * @param license The license to be viewed
       */
      displayComponent (license) {
        this.$router.push({ name: 'licenses_id', params: { id: license.id } })
      },

      sortName () {
        this.licenses = []
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=licenseName'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
      },
      sortVersion () {
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=licenseVersion'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
      },
      sortCreated () {
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=dateCreated'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
      },
      sortEdited () {
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=lastEdited'
        if (this.ordering === 'asc') {
          this.ordering = 'desc'
          newpayload.sort.order = '&order=desc'
        } else {
          this.ordering = 'asc'
          newpayload.sort.order = '&order=asc'
        }
        this.payload.sort = newpayload.sort
        this.payload.links = newpayload.links
        this.getMore(true)
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
  tr {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  th:hover {
    cursor: pointer;
    background-color: lightgray;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
