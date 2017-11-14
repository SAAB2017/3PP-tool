<!-- View for showing all signed projects -->
<template>
  <div class="projects-list">
    <!-- Table that contains all signed projects. Will grow to max-height and then
    become scrollable -->
    <div class="vertical-menu" style="max-height: 600px; min-width: 420px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th width="45%">Project</th>
          <th width=15%>Version</th>
          <th width="20%">Created</th>
          <th width="20%">Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="project in projects" @click="displayComponent(project)">
          <td>{{ project.projectName}}</td>
          <td>{{ project.projectVersion }}</td>
          <td>{{ project.dateCreated }}</td>
          <td>{{ project.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
    </div>

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
    data() {
      return {
        projects: [],
        project: null,
        projectVersion: null
      }
    },

    /* Fetches signed projects from the database and puts them in projects */
    mounted() {
      axios.get(this.$baseAPI + 'projects')
        .then(response => {
          this.projects = response.data
        })
    },

    methods: {
      /**
       * Searches for signed projects from the database matching the search-criteria
       */
      searchProject(){
        // TODO Implement method
      },

      /**
       * Opens the view for a specific project with id id.
       * @param project The project to be viewed
       */
      displayComponent(project) {
        this.$router.push({ name: "projects_id", params: { id: project.id } })
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
