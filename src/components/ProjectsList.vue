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
        <td>{{ project.project }}</td>
        <td>{{ project.version }}</td>
      </tr>
      </tbody>
    </table>
    <div class="field">
      <p class="control">
        <input v-model="project" class="input" type="text" placeholder="Name">
      </p>

      <p class="control">
        <input v-model="projectVersion" class="input" type="text" placeholder="Version">
      </p>

      <p class="control">
        <a @click="addproject" class="button is-primary">Add project</a>
      </p>
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
      }
    }
  }
</script>

