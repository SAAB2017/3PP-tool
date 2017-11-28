<!-- View for showing all unsigned projects -->
<template>
  <div class="projects-list">
    <!-- Table that contains all unsigned projects. Will grow to max-height and then
    become scrollable -->
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
      <tr v-for="project in projects" @click="displayProject(project)">
        <td scope="row" data-label="Project">{{ project.projectName }}</td>
        <td scope="row" data-label="Version">{{ project.projectVersion }}</td>
        <td scope="row" data-label="Created">{{ project.dateCreated }}</td>
        <td scope="row" data-label="Last edited">{{ project.lastEdited }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Field for searching for a project in the table. Uses "searchProject"-method -->
    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchProjects" class="input" type="text" placeholder="Find a project">
      </div>
      <div class="control">
        <a @click="searchProject" class="button is-primary">Search</a>
      </div>
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
        projectVersion: null
      }
    },
    /* Fetches unsigned projects from the database and puts them in projects */
    mounted () {
      axios.get(this.$baseAPI + 'projects/pending')
        .then(response => {
          this.projects = response.data
        })
    },

    methods: {
      /**
       * Searches for unsigned projects from the database matching the search-criteria
       */
      searchProject () {
        // TODO Implement method
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
  .projects-list {
    margin-bottom: 20px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
