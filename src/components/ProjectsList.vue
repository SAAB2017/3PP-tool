<template>
  <div class="projects-list">
    <div class="vertical-menu" style="max-height: 400px; min-width: 310px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th>Projects</th>
          <th width=1%>Version</th>
          <th>Created</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="project in projects" @click="displayComponent(project)">
          <td>{{ project.projectName}}</td>
          <td>{{ project.projectVersion }}</td>
          <td>{{ project.dateCreated }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="field has-addons" style="padding-top: 15px">
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
        this.$router.push({ name: "Project", params: { id: project.id } })
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
