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
          <div id="paginator" style="text-align: center;" @click="getMore()"><a class="button is-primary">Primary</a></div>
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
        components: [],
        component: null,
        componentVersion: null,
        searchComponents: null,
        sorted: '',
        reverse: 1,
        showPaginatorClick: true,
        searching: false,
        payload: null
      }
    },
    /* Fetches unsigned components from the database and puts them in components */
    mounted () {
      // TODO: getNext()
      this.$initPayload()
      this.getNext()
    },

    methods: {
      getMore () {
        if (this.searching === false) {
          this.getNext()
        } else {
          this.getNextSearchQuery()
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
        this.payload = this.$initPayload()
        this.showPaginatorClick = true
        if (this.searchComponents.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.components = []
          this.getNext()
          return
        }
        if ((this.searchComponents.length !== 0) && (this.searchComponents !== null) && (this.searchComponents !== '')) {
          const path = `components/pending/search/${this.searchComponents}/${this.payload.links.next}`
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
      getNext () {
        axios.get(this.$baseAPI + 'components/pending/' + this.payload.links.next)
          .then(response => {
            this.payload = response.data
            this.components = [...this.components, ...this.payload.items]
            if (this.components.length === this.payload.meta.count) {
              this.showPaginatorClick = null
            } else {
              this.showPaginatorClick = true
            }
          })
      },
      getNextSearchQuery () {
        console.log("next search is ran on : " + this.searchComponents)
        axios.get(this.$baseAPI + 'components/pending/search/' + this.searchComponents + '/' + this.payload.links.next)
          .then(response => {
            this.payload = response.data
            this.components = [...this.components, ...this.payload.items]
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
        console.log(`Component id is ${component}`)
        this.$router.push({ name: 'components_pending_id', params: { id: component.id } })
      },

      sortName () {
        if (this.sorted !== 'name') {
          this.sorted = 'name'
          this.reverse = 1
        }
        let t = this
        this.components.sort(function (a, b) {
          let lFirst = a.componentName.toLowerCase()
          let lSecond = b.componentName.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
      },

      sortVersion () {
        if (this.sorted !== 'version') {
          this.sorted = 'version'
          this.reverse = 1
        }
        let t = this
        this.components.sort(function (a, b) {
          let lFirst = a.componentVersion.toLowerCase()
          let lSecond = b.componentVersion.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
      },

      sortCreated () {
        if (this.sorted !== 'created') {
          this.sorted = 'created'
          this.reverse = 1
        }
        let t = this
        this.components.sort(function (a, b) {
          let lFirst = a.dateCreated.toLowerCase()
          let lSecond = b.dateCreated.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
      },

      sortEdited () {
        if (this.sorted !== 'created') {
          this.sorted = 'created'
          this.reverse = 1
        }
        let t = this
        this.components.sort(function (a, b) {
          let lFirst = a.lastEdited.toLowerCase()
          let lSecond = b.lastEdited.toLowerCase()
          if (lFirst < lSecond) {
            return -1 * t.reverse
          }
          if (lFirst > lSecond) {
            return 1 * t.reverse
          }
          return 0
        })
        this.reverse *= -1
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
