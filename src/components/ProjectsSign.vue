<!-- View for showing all unsigned projects -->
<template>
  <div class="products-list">

    <div id="message-text">
      <p class="help is-success subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>
    </div>

    <div id="top-div-child" class="columns is-mobile is-centered">
      <div id="top-search" class="field has-addons">
        <div class="control">
          <input v-on:keyup="searchProject()" v-model="searchProducts" class="input" type="text" placeholder="Find a product">
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
        <tr>
          <th scope="col">Project</th>
          <th scope="col">Version</th>
          <th scope="col">Created</th>
          <th scope="col">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="project in projects" @click="displayProject(project)">
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
        project: null,
        projectVersion: null,
        searchProjects: ''
      }
    },
    /* Fetches unsigned projects from the database and puts them in projects */
    mounted () {
      this.getAllPending()
    },

    methods: {
      getAllPending () {
        axios.get(this.$baseAPI + 'projects/pending')
          .then(response => {
            this.projects = response.data
          })
      },
      /**
       * Searches for unsigned projects from the database matching the search-criteria
       */
      searchProject () {
        // TODO Implement method
        if (this.searchProjects.length === 0) {
          this.getAllPending()
          return
        }
        if (this.searchProjects !== 0 || this.searchProjects !== null || this.searchProjects !== '') {
          axios.get(this.$baseAPI + 'projects/search/' + this.searchProjects).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.projects = response.data
            } else {
              this.message = 'No product found!'
            }
          })
        } else {
          this.getAllPending()
        }
      },

      /**
       * Opens the view for signing a specific project with id id.
       * @param project The project to be signed
       */
      displayProject (project) {
        console.log(`Project id is ${project}`)
        this.$router.push({ name: 'projects_pending_id', params: { id: project.id } })
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

  .products-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
