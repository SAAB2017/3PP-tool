<!-- View for showing all signed components -->

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
  <div class="components-list">
    <!-- Table that contains all signed components. Will grow to max-height and then
    become scrollable -->

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
  import payloadcfg from '../../backend/routes/config.js'
  export default {
    data () {
      return {
        components: [],
        component: null,
        componentVersion: null,
        searchComponents: null,
        message: '',
        showPaginatorClick: true,
        searching: false,
        payload: this.payloadFactory()
      }
    },

    /* Fetches signed components from the database and puts them in components */
    mounted () {
      console.log(this.$route.params)
      if (this.$route.params.type === 'signed') {
        this.message = 'Component "' + this.$route.params.sName + '" (version: ' + this.$route.params.sVersion + ') signed'
        this.$route.params.type = ''
        console.log(this.message)
      }
      this.payload = this.payloadFactory()
      this.getNext(false)
      this.fade_out()
    },

    methods: {
      /**
       * Searches for signed components from the database matching the search-criteria
       */

      payloadFactory: payloadcfg.payloadInit.bind(null, 'component'),
      /**
       * Opens the view for a specific component with id id.
       * @param component The component to be viewed
       */
      displayComponent (component) {
        this.$router.push({ name: 'components_id', params: { id: component.id } })
      },

      /**
       * Fetches all components from database
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
          const path = `components/search/${this.searchComponents}/${this.payload.links.next}${this.payload.sort.column}${this.payload.sort.order}`
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

      // GET METHODS
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (replaceItemsList) {
        axios.get(this.$baseAPI + 'components/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.components = [...this.payload.items] : this.components = [...this.components, ...this.payload.items]
            this.components.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
          }
          )
      },
      getNextSearchQuery (replaceItemsList) {
        axios.get(this.$baseAPI + 'components/search/' + this.searchComponents + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
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
       * Shows this.message for some time then fades it away and removes it.
       */
      fade_out () {
        let msg = document.getElementById('message-text')
        let page = this
        let count = 1
        let fadeEffect = setInterval(function () {
          if (!msg.style.opacity) {
            msg.style.opacity = 1
          }
          if (count < 0.1) {
            page.message = ''
            clearInterval(fadeEffect)
          } else {
            count -= 0.01
            if (count < 0.2) {
              msg.style.opacity -= 0.1
            }
          }
        }, 100)
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

        console.log(this.$baseAPI + 'components/' + newpayload.links.next + newpayload.sort.column + newpayload.sort.order)
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
