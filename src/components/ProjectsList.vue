<template>
  <div class="projects-list">
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

    mounted() {
      axios.get(this.$baseAPI + 'projects')
        .then(response => {
          this.projects = response.data
        })
    },

    methods: {

      searchProject(){
        // TODO Implement method
      },

      displayComponent(project) {
        this.$router.push({ name: "projects_id", params: { id: project.id } })
      }
      /* TODO should be able to delete this
      addproject() {
        var data = {
          project: this.project,
          version: this.projectVersion
        }

        axios.post(this.$baseAPI + 'projects', data)
          .then(response => {
            if (response.data === "success") {
              this.project = null
              this.projectVersion = null

              axios.get(this.$baseAPI + 'projects')
                .then(response => {
                  this.projects = response.data
                })
            }
          })
      } */
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
