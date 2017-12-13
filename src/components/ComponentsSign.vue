qs<!-- Viezx w for showing all unsigned components -->
s<!-- Viezx w for showing all unsigned components -->
<template>
  <div class="components-list">

    <div id="message-text">
      <p class="help is-success subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>
    </div>
    <div id="top-div-child" class="columns is-mobile is-centered">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-model="searchSignComponents" class="input" type="text" placeholder="Find a component">
        </div>
        <div class="control">
          <button @click="searchComponent(this.searchSignComponents)" class="button is-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Table that contains all unsigned components. Will grow to max-height and then
    become scrollable -->
    <div id="table-div">
      <table>
        <thead>
        <tr style="background-color: white">
          <th scope="col" @click="sortName()">Component</th>
          <th scope="col" @click="sortVersion()">Version</th>
          <th scope="col" @click="sortCreated()">Created</th>
          <th scope="col" @click="sortEdited()">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <transition-group name="list" appear>
          <tr v-for="component in components" @click="displayComponent(component)" v-bind:key="component" class="list-item">
            <td scope="row" data-label="Component">{{ component.componentName }}</td>
            <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
            <td scope="row" data-label="Created">{{ component.dateCreated }}</td>
            <td scope="row" data-label="Last edited">{{ component.lastEdited }}</td>
          </tr>
        </transition-group>

        <tr v-if="showPaginatorClick">
          <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Hämta in fler</a></div>
        </tr>

        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import payloadcfg from '../../backend/routes/config'
  export default {
    data () {
      return {
        components: [],
        component: null,
        componentVersion: null,
        searchSignComponents: null,
        sorted: '',
        showPaginatorClick: true,
        searching: false,
        payload: null,
        initPayload: this.payloadFactory()
      }
    },
    /* Fetches unsigned components from the database and puts them in components */
    mounted () {
      // TODO: getNext()
      this.payload = this.payloadFactory()
      this.getNext(true)
    },

    watch: {
      searchSignComponents: function (a) {
        if (a.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.components = []
          this.payload = this.payloadFactory()
          this.getNext(true)
        } else if (a.length > 0) {
          this.searching = true
          let sort = this.payload.sort
          this.payload = this.payloadFactory()
          this.payload.sort = sort
          this.searchComponent(a)
        }
      },
      components: function (a) {
        if (a.length === this.payload.meta.count) {
          this.showPaginatorClick = false
        } else if (a.length < this.payload.meta.count) {
          this.showPaginatorClick = true
        }
      },
      // watch for change in ordering; cancel out content
      ordering: function (a) {
        this.components = []
      }
    },

    methods: {
      payloadFactory: payloadcfg.payloadInit.bind(null, 'component'),
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      // TODO: behöver städa upp. men huvud funktionalitet i sök + hämtning av data för / och /pending, samt /search och /pending/search
      /**
       * Searches for unsigned components from the database matching the search-criteria
       */
      searchComponent (search) {
        const path = 'components/pending/search/' + search + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
        let _this = this
        axios.get(this.$baseAPI + path).then(response => {
          if (response.data != null) {
            _this.payload = response.data
            _this.components = _this.payload.items
            if (_this.components.length === _this.payload.meta.count) {
              _this.showPaginatorClick = false
            }
          } else {
            _this.message = 'No component found!'
          }
        }).catch(err => {
          console.log(err)
        })
      },

      getNext (replaceItemsList) {
        axios.get(this.$baseAPI + 'components/pending/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.components = [...this.payload.items] : this.components = [...this.components, ...this.payload.items]
            this.components.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
          })
      },
      getNextSearchQuery (replaceItemsList) {
        let p = this.$baseAPI + 'components/pending/search/' + this.searchSignComponents + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
        axios.get(p)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.components = [...this.payload.items] : this.components = [...this.components, ...this.payload.items]
            if (this.components.length === this.payload.meta.count) {
              this.showPaginatorClick = null
            } else {
              this.showPaginatorClick = true
            }
          }).catch(err => {
            console.log(err)
        })
      },
      /**
       * Opens the view for signing a specific component with id id.
       * @param component The component to be signed
       */
      displayComponent (component) {
        this.$router.push({ name: 'components_id', params: { id: component.id } })
      },

      sortName () {
        let newpayload = this.payloadFactory()
        newpayload.sort.column = '&sort=componentName'
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
        newpayload.sort.column = '&sort=componentVersion'
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

  .components-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
