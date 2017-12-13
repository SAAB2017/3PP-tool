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
<!-- View for showing all signed projects -->
<template>
  <div class="projects-list">
    <!-- Table that contains all signed projects. Will grow to max-height and then
    become scrollable -->

    <div id="message-text">
      <p class="help is-success subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>
    </div>

    <div id="top-div-child" class="columns is-mobile is-centered">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-model="searchProjects" class="input" type="text" placeholder="Find a project">
        </div>
        <div class="control">
          <button @click="searchProject()" class="button is-primary">Search</button>
        </div>
      </div>
    </div>

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
        <tr v-for="project in projects" @click="displayComponent(project)" v-bind:key="project">
          <td scope="row" data-label="Project">{{ project.projectName }}</td>
          <td scope="row" data-label="Version">{{ project.projectVersion }}</td>
          <td scope="row" data-label="Created">{{ project.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ project.lastEdited }}</td>
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
        projects: [],
        project: null,
        projectVersion: null,
        searchProjects: null,
        searching: false,
        message: '',
        sorted: '',
        showPaginatorClick: true,
        payload: this.payloadFactory()
      }
    },

    /* Fetches signed projects from the database and puts them in projects */
    mounted () {
      if (this.$route.params.type === 'signed') {
        this.message = 'Project "' + this.$route.params.sName + '" (version: ' + this.$route.params.sVersion + ') signed'
        this.$route.params.type = ''
      }
      this.getNext = this.getNext.bind(this, 'projects/')
      this.getMore = this.getMore.bind(this, 'projects/')
      this.getNextSearchQuery = this.getNextSearchQuery.bind(this, 'projects/')
      this.getNext(true)
      this.fade_out()
    },
    watch: {
      searchProjects: function (a) {
        if (a.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.projects = []
          this.payload = this.payloadFactory()
          this.getNext(true)
        } else if (a.length > 0) {
          this.searching = true
          let sort = this.payload.sort
          this.payload = this.payloadFactory()
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
      payloadFactory: payloadcfg.payloadInit.bind(null, 'project'),
      /**
       * Searches for signed projects from the database matching the search-criteria
       */
      searchProject (search) {
        const path = `projects/search/${search}/${this.payload.links.next}` + this.payload.sort.column + this.payload.sort.order
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
       * Opens the view for a specific project with id id.
       * @param project The project to be viewed
       */
      displayComponent (project) {
        this.$router.push({name: 'projects_id', params: {id: project.id}})
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
        axios.get(this.$baseAPI + uri + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            _this.payload = response.data
            replaceItemsList ? _this.projects = [..._this.payload.items] : _this.projects = [..._this.projects, ..._this.payload.items]
            _this.projects.length === _this.payload.meta.count ? _this.showPaginatorClick = null : _this.showPaginatorClick = true
          }).catch(err => console.log(err))
      },
      getNextSearchQuery (uri, replaceItemsList) {
        let _this = this
        if (this.projects.length < this.payload.meta.count) {
          axios.get(this.$baseAPI + `${uri}/search/` + this.searchProjects + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
            .then(response => {
              _this.payload = response.data
              replaceItemsList ? _this.projects = [..._this.payload.items] : _this.projects = [..._this.projects, ..._this.payload.items]
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
      getAllProjects () {
        axios.get(this.$baseAPI + 'projects/')
          .then(response => {
            this.projects = response.data
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
        let newpayload = this.payloadFactory('project')
        newpayload.sort.column = '&sort=projectName'
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
        let newpayload = this.payloadFactory('project')
        newpayload.sort.column = '&sort=projectVersion'
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
        let newpayload = this.payloadFactory('project')
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
        let newpayload = this.payloadFactory('project')
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

  .projects-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
