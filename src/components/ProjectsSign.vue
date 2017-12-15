<style>
  .project-fade-enter-active, .project-fade-leave-active {
    transition: opacity .127s ease;
  }
  .project-fade-enter, .project-fade-leave-to
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

<!-- View for showing all unsigned projects -->
<template>
  <div class="products-list">

    <div id="message-text">
      <p class="help is-success subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>
    </div>

    <div id="top-div-child" class="columns is-mobile is-centered">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-model="searchProjects" class="input" type="text" placeholder="Find a product">
        </div>
        <div class="control">
          <button @click="searchProject()" class="button is-primary">Search</button>
        </div>
      </div>
    </div>

    <!-- Table that contains all unsigned products. Will grow to max-height and then
    become scrollable -->
    <div id="table-div">
      <table>
        <thead>
        <tr style="background-color: white">
          <th scope="col" @click="sortName()">Project</th>
          <th scope="col" @click="sortVersion()">Version</th>
          <th scope="col" @click="sortCreated()">Created</th>
          <th scope="col" @click="sortEdited()">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <transition-group  name="list" appear>
        <tr v-for="project in projects" @click="displayProject(project)" v-bind:key="project">
          <td scope="row" data-label="Project">{{ project.projectName }}</td>
          <td scope="row" data-label="Version">{{ project.projectVersion }}</td>
          <td scope="row" data-label="Created">{{ project.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ project.lastEdited }}</td>
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

  const URI = 'projects/pending/'
  export default {
    data () {
      return {
        projects: [],
        project: null,
        projectVersion: null,
        searchProjects: null,
        searching: false,
        message: '',
        sorted: '',
        showPaginatorClick: true,
        payload: this.payloadInit('project')
      }
    },
    /* Fetches unsigned projects from the database and puts them in projects */
    mounted () {
      this.getNext = this.getNext.bind(this, 'projects/pending')
      this.getMore = this.getMore.bind(this, 'projects/pending')
      this.getNextSearchQuery = this.getNextSearchQuery.bind(this, 'projects/pending')
      this.getNext(true)
    },

    watch: {
      searchProjects: function (a) {
        if (a.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.projects = []
          this.payload = this.payloadInit('project')
          this.getNext(true)
        } else if (a.length > 0) {
          this.searching = true
          let sort = this.payload.sort
          this.payload = this.payloadInit('project')
          this.payload.sort = sort
          this.searchProject(a)
        }
      },
      projects: function (a) {
        if (a.length === this.payload.meta.count) {
          this.showPaginatorClick = false
        } else if (a.length < this.payload.meta.count) {
          this.showPaginatorClick = true
        }
      }
    },

    methods: {
      payloadInit(type) {
        return { // a default payload, can/should be extended
          items: [],
          links: {
            prev: '?offset=0&amount=' + 25,
            current: '?offset=0&amount=' + 25,
            next: '?offset=0&amount=' + 25
          },
          sort: {
            column: '&sort=' + type + 'Name',
            order: '&order=asc'
          },
          meta: {
            current: 0,
            count: 0
          },
          errors: {
            message: [],
            status: 'OK'
          },
          errorflag: false
        }
      },
      /**
       * Fetches all projects from database
       */
      getMore (uri, replaceItemsList) {
        let _this = this
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          _this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (uri, replaceItemsList) {
        let _this = this
        axios.get(this.$baseAPI + 'projects/pending/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            _this.payload = response.data
            replaceItemsList ? _this.projects = _this.payload.items : _this.projects = _this.projects.concat(_this.payload.items)
            _this.projects.length === _this.payload.meta.count ? _this.showPaginatorClick = null : _this.showPaginatorClick = true
          }).catch(err => console.log(err))
      },
      getNextSearchQuery (uri, replaceItemsList) {
        let _this = this
        if (this.projects.length < this.payload.meta.count) {
          axios.get(this.$baseAPI + 'projects/pending' + '/search/' + this.searchProjects + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
            .then(response => {
              _this.payload = response.data
              replaceItemsList ? _this.projects = _this.payload.items : _this.projects = _this.projects.concat(_this.payload.items)
              if (_this.projects.length === _this.payload.meta.count) {
                _this.showPaginatorClick = null
              } else {
                _this.showPaginatorClick = true
              }
            }).catch(err => console.log(err))
        } else {
          this.showPaginatorClick = null
        }
      },
      /**
       * Searches for unsigned projects from the database matching the search-criteria
       */
      searchProject (search) {
        const path = 'projects/pending/search/' + search + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
        let _this = this
        axios.get(this.$baseAPI + path).then(response => {
          if (response.data != null) {
            _this.payload = response.data
            _this.projects = [..._this.payload.items]
            if (_this.projects.length === _this.payload.meta.count) {
              _this.showPaginatorClick = false
            }
          } else {
            _this.message = 'No component found!'
          }
        }).catch(err => {
          console.log(err)
        })
      },

      /**
       * Opens the view for signing a specific project with id id.
       * @param project The project to be signed
       */
      displayProject (project) {
        this.$router.push({ name: 'projects_id', params: { id: project.id } })
      },

      sortName () {
        if (this.sorted !== 'name') {
          this.sorted = 'name'
          this.reverse = 1
        }
        let t = this
        this.projects.sort(function (a, b) {
          let lFirst = a.projectName.toLowerCase()
          let lSecond = b.projectName.toLowerCase()
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
        this.projects.sort(function (a, b) {
          let lFirst = a.projectVersion.toLowerCase()
          let lSecond = b.projectVersion.toLowerCase()
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
        this.projects.sort(function (a, b) {
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
        this.projects.sort(function (a, b) {
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

  .projects-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
