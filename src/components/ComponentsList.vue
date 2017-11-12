<template>
  <div class="component-list">
    <div class="vertical-menu" style="max-height: 600px; min-width: 420px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th>Components</th>
          <th width=1%>Version</th>
          <th>Created</th>
          <th>Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="component in components" @click="displayComponent(component)">
          <td>{{ component.componentName }}</td>
          <td>{{ component.componentVersion }}</td>
          <td>{{ component.dateCreated }}</td>
          <td>{{ component.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchComponents" class="input" type="text" placeholder="Find a component">
      </div>
      <div class="control">
        <a @click="searchComponent" class="button is-primary">Search</a>
      </div>
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
      axios.get(this.$baseAPI + 'components/')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {

      searchComponent(){
        // TODO Implement method
      },

      displayComponent(component) {
        this.$router.push({ name: "components_id", params: { id: component.id } })
      }
      /* TODO Should be able to delete this
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
      }, */

    }
  }
</script>

<style scoped>
  .component-list {
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
