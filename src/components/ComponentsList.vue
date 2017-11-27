<!-- View for showing all signed components -->
<style>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<template>
  <div class="component-list">
    <!-- Table that contains all signed components. Will grow to max-height and then
    become scrollable -->

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchComponent()" v-model="searchComponents" class="input" type="text" placeholder="Find a component">
      </div>
      <div class="control">
        <button @click="searchComponent()" class="button is-primary">Search</button>
      </div>
      <div>
        <select id="pagesize" v-model.number="pageCountSettings" type="number">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>

      <table>
        <thead>
        <tr>
          <th scope="col">Component</th>
          <th scope="col">Version</th>
          <th scope="col">Created</th>
          <th scope="col">Last edited</th>
        </tr>
        </thead>
        <tbody class="">
        <transition-group name="list" appear>
        <tr v-for="component in components" @click="displayComponent(component)" v-bind:key="component" class="list-item">
          <td scope="row" data-label="Component">{{ component.componentName }}</td>
          <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
          <td scope="row" data-label="Created">{{ component.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ component.lastEdited }}</td>
        </tr>
        </transition-group>

        <tr v-if="showPaginatorClick">
          <div id="paginator" style="text-align: center;" @click="getNextPage()">...Click here for more results...</div>
        </tr>
        </tbody>
      </table>

    <!-- Field for searching for a component in the table. Uses "searchComponent"-method -->

  </div>

</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        components: [],
        searchComponents: null,
        component: null,
        componentVersion: null,
        page: 0,
        pageCount: 0,
        total: 0,
        showPaginatorClick: true,
        pageCountSettings: 10,
      }
    },
    /* Fetches signed components from the database and puts them in components */
    mounted () {
      this.getPageCount()
      this.getFirst()
    },

    methods: {
      /**
       * Searches for signed components from the database matching the search-criteria
       */
      searchComponent () {
        if (this.searchComponents.length === 0) {
          this.getAllComponents()
          console.log("mofo")
          return
        }
        if (this.searchComponents !== 0 || this.searchComponents !== null || this.searchComponents !== '') {
          axios.get(this.$baseAPI + 'components/search/' + this.searchComponents).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.components = response.data
            } else {
              this.message = 'No component found!'
            }
            console.log(this.searchComponents)
          })
        } else {
          this.getAllComponents()
        }
      },

      /**
       * Opens the view for a specific component with id id.
       * @param component The component to be viewed
       */
      displayComponent (component) {
        this.$router.push({ name: 'components_id', params: { id: component.id } })
      },
      getFirst () {
        axios.get(this.$baseAPI + 'components/?page=0&amount=5')
          .then(response => {
            this.components = response.data
          })
      },
      getAllComponents () {
        axios.get(this.$baseAPI + 'components/')
          .then(response => {
            this.components = response.data
          })
      },
      getNextPage () {
        if (this.components.length < this.total) {
          this.page += 1
          axios.get(this.$baseAPI + `components/?page=${this.page}&amount=5`)
            .then(response => {
              response.data.forEach(elem => this.components.push(elem))
              console.log(`Current page: ${this.page} len: ${this.components.length} total: ${this.total}`)
            })
        }
        if (this.components.length === this.total) {
          this.showPaginatorClick = null
        }
      },
      getPageCount () {
        axios.get(this.$baseAPI + `components/?totalElements`)
          .then(response => {
            this.total = response.data.rowCount
            if (this.total < 100) {
              this.pageCount = 1
            } else {
              this.pageCount = Math.ceil(response.data.rowCount / 5)
            }
          })
      },
      showModal () {
        let d = document.getElementById('modal')
        d.classList.add('is-active')
      },

      closeModal () {
        let d = document.getElementById('modal')
        d.classList.remove('is-active')
      }
    }
  }
</script>

<style scoped>

  .component-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
