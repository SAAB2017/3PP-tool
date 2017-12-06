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
          <input v-on:keyup="searchProject()" v-model="searchProjects" class="input" type="text" placeholder="Find a project">
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
        <tr v-for="project in projects" @click="displayComponent(project)">
          <td scope="row" data-label="Project">{{ project.projectName }}</td>
          <td scope="row" data-label="Version">{{ project.projectVersion }}</td>
          <td scope="row" data-label="Created">{{ project.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ project.lastEdited }}</td>
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
        projects: [],
        searchProjects: null,
        project: null,
        projectVersion: null,
        message: '',
        sorted: '',
        reverse: 1
      }
    },

    /* Fetches signed projects from the database and puts them in projects */
    mounted () {
      console.log(this.$route.params)
      if (this.$route.params.type === 'signed') {
        this.message = 'Project "' + this.$route.params.sName + '" (version: ' + this.$route.params.sVersion + ') signed'
        this.$route.params.type = ''
        console.log(this.message)
      }
      this.getAllProjects()
      this.fade_out()
    },

    methods: {
      /**
       * Searches for signed projects from the database matching the search-criteria
       */
      searchProject () {
        if (this.searchProjects.length === 0) {
          this.getAllProjects()
          return
        }
        if (this.searchProjects !== 0 || this.searchProjects !== null || this.searchProjects !== '') {
          axios.get(this.$baseAPI + 'projects/search/' + this.searchProjects).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.projects = response.data
            } else {
              this.message = 'No project found!'
            }
          })
        } else {
          this.getAllProjects()
        }
      },

      /**
       * Opens the view for a specific project with id id.
       * @param project The project to be viewed
       */
      displayComponent (project) {
        this.$router.push({ name: 'projects_id', params: { id: project.id } })
      },

      /**
       * Fetches all projects from database
       */
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
