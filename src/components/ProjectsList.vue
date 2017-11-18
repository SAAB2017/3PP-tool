<!-- View for showing all signed projects -->
<template>
  <div class="projects-list">
    <!-- Table that contains all signed projects. Will grow to max-height and then
    become scrollable -->

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchProject()" v-model="searchProjects" class="input" type="text" placeholder="Find a project">
      </div>
      <div class="control">
        <button @click="searchProject()" class="button is-primary">Search</button>
      </div>
    </div>

      <table>
        <thead>
        <tr>
          <th scope="col">Project</th>
          <th scope="col">Version</th>
          <th scope="col">Created</th>
          <th scope="col">Last edited</th>
        </tr>
        </thead>
        <tbody class="tbodyhome">
        <tr v-for="project in projects" @click="displayComponent(project)">
          <td scope="row" data-label="Project">{{ project.projectName}}</td>
          <td scope="row" data-label="Version">{{ project.projectVersion }}</td>
          <td scope="row" data-label="Created">{{ project.dateCreated }}</td>
          <td scope="row" data-label="Last edited">{{ project.lastEdited }}</td>
        </tr>
        </tbody>
      </table>

    <!-- Field for searching for a project in the table. Uses "searchProject"-method -->


    <div class="columns is-mobile is-centered">
      <projects-add-modal></projects-add-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ProjectsAddModal from '@/components/ProjectsAddModal'

  export default {
    components: {
      ProjectsAddModal
    },
    data() {
      return {
        projects: [],
        searchProjects: null,
        project: null,
        projectVersion: null
      }
    },
    /* Fetches signed projects from the database and puts them in projects */
    mounted() {
      this.getAllProjects()
    },

    methods: {
      /**
       * Searches for signed projects from the database matching the search-criteria
       */
      searchProject(){
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
              this.message = "No project found!"
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
      displayComponent(project) {
        this.$router.push({ name: "projects_id", params: { id: project.id } })
      },
      getAllProjects() {
        axios.get(this.$baseAPI + 'projects/')
          .then(response => {
            this.projects = response.data
          })
      }
    }
  }
</script>

<style scoped>

  .projects-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
  .vertical-menu {
    width: 100%;
    overflow-y: auto;
  }
</style>
