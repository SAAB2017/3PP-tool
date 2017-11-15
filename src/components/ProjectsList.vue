<!-- View for showing all signed projects -->
<template>
  <div class="projects-list">
    <!-- Table that contains all signed projects. Will grow to max-height and then
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
        <tbody>
        <tr v-for="project in projects" @click="displayComponent(project)">
          <td scope="row" data-label="Project">{{ project.projectName}}</td>
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
