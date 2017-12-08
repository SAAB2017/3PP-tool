<!-- View for showing all unsigned components -->
<template>
  <div class="components-list">

    <div id="message-text">
      <p class="help is-success subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>
    </div>

    <div id="top-div-child" class="columns is-mobile is-centered">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-on:keyup="searchComponent()" v-model="searchComponents" class="input" type="text" placeholder="Find a component">
        </div>
        <div class="control">
          <button @click="searchComponent()" class="button is-primary">Search</button>
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
          <div id="paginator" style="text-align: center;" @click="getMore()"><a class="button is-primary">Hämta in fler</a></div>
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
        searchComponents: null,
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

    methods: {
      payloadFactory: payloadcfg.payloadInit.bind(null, 'component'),
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      getAllPending () {
        axios.get(this.$baseAPI + 'components/pending')
          .then(response => {
            this.components = response.data
          })
      },
      // TODO: behöver städa upp. men huvud funktionalitet i sök + hämtning av data för / och /pending, samt /search och /pending/search
      /**
       * Searches for unsigned components from the database matching the search-criteria
       */
      searchComponent () {
        this.searching = true
        let sort = this.payload.sort
        this.payload = this.payloadFactory()
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchComponents.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.components = []
          this.getNext(true)
          return
        }
        if ((this.searchComponents.length !== 0) && (this.searchComponents !== null) && (this.searchComponents !== '')) {
          const path = `components/pending/search/${this.searchComponents}/${this.payload.links.next}` + this.payload.sort.column + this.payload.sort.order
          console.log(path)
          axios.get(this.$baseAPI + path).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.payload = response.data
              this.components = [...this.payload.items]
            } else {
              this.message = 'No component found!'
            }
          })
        }
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
        axios.get(this.$baseAPI + 'components/pending/search/' + this.searchComponents + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.components = [...this.payload.items] : this.components = [...this.components, ...this.payload.items]
            if (this.components.length === this.payload.meta.count) {
              this.showPaginatorClick = null
            } else {
              this.showPaginatorClick = true
            }
          })
      },
      /**
       * Opens the view for signing a specific component with id id.
       * @param component The component to be signed
       */
      displayComponent (component) {
        console.log(`Component id is ${component.id}`)
        this.$router.push({ name: 'components_pending_id', params: { id: component.id } })
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
        console.log(this.$baseAPI + 'components/pending/' + newpayload.links.next + newpayload.sort.column + newpayload.sort.order)
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
