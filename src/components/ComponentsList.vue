<template>
  <div class="component-list">
    <table class="table is-bordered">
      <thead>
      <tr>
        <th>Components</th>
        <th width=1%>Version</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="component in components" @click="displayComponent(component)">
        <td>{{ component.component }}</td>
        <td>{{ component.version }}</td>
      </tr>
      </tbody>
    </table>
    <div class="field">
      <p class="control">
        <input v-model="component" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="componentVersion" class="input" type="text" placeholder="Version">
      </p>

      <p class="control">
        <a @click="addComponent" class="button is-primary">Add component</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        components: [],
        component: null,
        componentVersion: null
      }
    },

    mounted() {
      axios.get(this.$baseAPI + 'components')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {
      addComponent() {
        let data = {
          component: this.component,
          version: this.componentVersion
        }

        axios.post(this.$baseAPI + 'components', data)
          .then(response => {
            if (response.data === "success") {
              this.component = null
              this.componentVersion = null

              axios.get(this.$baseAPI + 'components')
                .then(response => {
                  this.components = response.data
                })
            }
          })
      },

      displayComponent(component) {
        this.$router.push({ name: "Component", params: { id: component.id } })
      }
    }
  }
</script>

<style scoped>
  .component-list {
    margin-bottom: 30px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }
</style>
