<template>
  <div class="projects-list">
    <table class="table is-bordered">
      <thead>
      <tr>
        <th>Projects</th>
        <th width=1%>Version</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="project in projects">
        <td>{{ project.projectName}}</td>
        <td>{{ project.projectVersion }}</td>
      </tr>
      </tbody>
    </table>
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

