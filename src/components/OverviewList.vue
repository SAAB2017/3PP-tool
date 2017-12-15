<style>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .127s ease;
  }
  .component-fade-enter, .component-fade-leave-to
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

<template>
  <div class="products-list">

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="select">
        <select id="selected" v-on:change="selectChanged()">
          <option value="licenses">Licenses</option>
          <option value="components">Components</option>
          <option value="products">Products</option>
          <option value="projects" selected>Projects</option>
        </select>
      </div>
      <div class="control">
        <input v-on:keyup="search()" v-model="searchQuery" class="input" type="text" placeholder="Search">
      </div>
      <div class="control">
        <button @click="search()" class="button is-primary">Search</button>
      </div>
    </div>

    <table v-if="dispThing.length !== 0">
      <thead>
      <tr>
        <th scope="col" @click="sortName()">{{ selectedText }}</th>
        <th scope="col" @click="sortVersion()">Version</th>
        <th scope="col" @click="sortCreated()">Created</th>
        <th scope="col" @click="sortEdited()">Last edited</th>
      </tr>
      </thead>
      <tbody>
      <transition-group name="list" appear>
        <tr v-for="comp in dispThing" @click="display(comp)" v-bind:key="comp" class="list-item">
          <td v-if="selected === 'products'" scope="row" data-label="Product">{{ comp.productName }}</td>
          <td v-if="selected === 'projects'" scope="row" data-label="Product">{{ comp.projectName }}</td>
          <td v-if="selected === 'components'" scope="row" data-label="Product">{{ comp.componentName }}</td>
          <td v-if="selected === 'licenses'" scope="row" data-label="Product">{{ comp.licenseName }}</td>
          <td v-if="selected === 'products'" scope="row" data-label="Version">{{ comp.productVersion }}</td>
          <td v-if="selected === 'projects'" scope="row" data-label="Version">{{ comp.projectVersion }}</td>
          <td v-if="selected === 'components'" scope="row" data-label="Version">{{ comp.componentVersion }}</td>
          <td v-if="selected === 'licenses'" scope="row" data-label="Version">{{ comp.licenseVersion }}</td>
          <td scope="row" data-label="Created">{{ comp.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ comp.lastEdited }}</td>
        </tr>
      </transition-group>

      <tr v-if="showPaginatorClick">
        <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Get more</a></div>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  // import payloadcfg from '../../backend/routes/config.js'
  let payloadcfg = require('../../backend/routes/config')
  export default {
    data () {
      return {
        dispThing: [],
        selected: 'projects',
        selectedText: 'Projects',
        searchQuery: null,
        showPaginatorClick: true,
        searching: false,
        payload: this.projectPayloadFactory()
      }
    },

    /* mounted () {
      this.payload = this.projectPayloadFactory()
      this.getNext(false)
    }, */

    methods: {

      projectPayloadFactory: payloadcfg.payloadInit.bind(null, 'project'),
      productPayloadFactory: payloadcfg.payloadInit.bind(null, 'product'),
      componentPayloadFactory: payloadcfg.payloadInit.bind(null, 'component'),
      licensePayloadFactory: payloadcfg.payloadInit.bind(null, 'license'),

      selectChanged () {
        let e = document.getElementById('selected')
        this.selected = e.options[e.selectedIndex].value
        this.selectedText = e.options[e.selectedIndex].text
        this.dispThing = []
        this.searchQuery = ''
        if (this.selected === 'projects') {
          this.payload = this.projectPayloadFactory()
        } else if (this.selected === 'products') {
          this.payload = this.productPayloadFactory()
        } else if (this.selected === 'components') {
          this.payload = this.componentPayloadFactory()
        } else {
          this.payload = this.licensePayloadFactory()
        }
        this.searching = false

        this.showPaginatorClick = true
      },
      /**
       * Searches for signed products from the database matching the search-criteria
       */
      search () {
        this.searching = true
        let sort = this.payload.sort
        if (this.selected === 'projects') {
          this.payload = this.projectPayloadFactory()
        } else if (this.selected === 'products') {
          this.payload = this.productPayloadFactory()
        } else if (this.selected === 'components') {
          this.payload = this.componentPayloadFactory()
        } else {
          this.payload = this.licensePayloadFactory()
        }
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchQuery.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.dispThing = []
          // this.getNext(false)
          return
        }
        if ((this.searchQuery.length !== 0) && (this.searchQuery !== null) && (this.searchQuery !== '')) {
          const path = this.selected + '/search/' + this.searchQuery + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
          axios.get(this.$baseAPI + path).then(response => {
            if (response.data !== null) {
              this.payload = response.data
              this.dispThing = this.payload.items
              if (this.dispThing.length < 5) {
                this.showPaginatorClick = false
              }
            } else {
              this.message = 'No component found!'
            }
          })
        }
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
        axios.get(this.$baseAPI + this.selected + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.dispThing = this.payload.items : this.dispThing = this.dispThing.concat(this.payload.items)
            this.dispThing.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
          })
      },
      getNextSearchQuery (replaceItemsList) {
        axios.get(this.$baseAPI + this.selected + '/search/' + this.searchQuery + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.dispThing = this.payload.items : this.dispThing = this.dispThing.concat(this.payload.items)
            if (this.dispThing.length === this.payload.meta.count) {
              this.showPaginatorClick = null
            } else {
              this.showPaginatorClick = true
            }
          })
      },

      /**
       * Opens the view for a specific product with id id.
       * @param comp The product to be viewed
       */
      display (comp) {
        let push = this.selected + '_id'
        this.$router.push({ name: push, params: { id: comp.id } })
      },


      sortName () {
        let newpayload
        let type
        if (this.selected === 'projects') {
          newpayload = this.projectPayloadFactory()
          type = 'project'
        } else if (this.selected === 'products') {
          newpayload = this.productPayloadFactory()
          type = 'product'
        } else if (this.selected === 'components') {
          newpayload = this.componentPayloadFactory()
          type = 'component'
        } else {
          newpayload = this.licensePayloadFactory()
          type = 'license'
        }
        newpayload.sort.column = '&sort=' + type + 'Name'
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
        let newpayload
        let type
        if (this.selected === 'projects') {
          newpayload = this.projectPayloadFactory()
          type = 'project'
        } else if (this.selected === 'products') {
          newpayload = this.productPayloadFactory()
          type = 'product'
        } else if (this.selected === 'components') {
          newpayload = this.componentPayloadFactory()
          type = 'component'
        } else {
          newpayload = this.licensePayloadFactory()
          type = 'license'
        }
        newpayload.sort.column = '&sort=' + type + 'Version'
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
        let newpayload
        if (this.selected === 'projects') {
          newpayload = this.projectPayloadFactory()
        } else if (this.selected === 'products') {
          newpayload = this.productPayloadFactory()
        } else if (this.selected === 'components') {
          newpayload = this.componentPayloadFactory()
        } else {
          newpayload = this.licensePayloadFactory()
        }
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
        let newpayload
        if (this.selected === 'projects') {
          newpayload = this.projectPayloadFactory()
        } else if (this.selected === 'products') {
          newpayload = this.productPayloadFactory()
        } else if (this.selected === 'components') {
          newpayload = this.componentPayloadFactory()
        } else {
          newpayload = this.licensePayloadFactory()
        }
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
  .products-list {
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
