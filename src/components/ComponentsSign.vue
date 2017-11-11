<template>
  <div class="components-list">
    <div class="vertical-menu" style="max-height: 400px; max-width: 320px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th>Component name</th>
          <th width=1%>Version</th>
          <th>Date Created</th>
          <th>Last edited</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="component in components" @click="displayComponent(component.id)">
          <td>{{ component.componentName}}</td>
          <td>{{ component.componentVersion }}</td>
          <td>{{ component.dateCreated }}</td>
          <td>{{ component.lastEdited }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="field has-addons" style="padding-top: 15px">
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

    mounted () {
      const pendingURI = 'components/' + JSON.stringify({approved: 0})
      axios.get(this.$baseAPI + pendingURI)
        .then(response => {
          this.components = response.data
        })
    },

    methods: {

      searchComponent(){
        // TODO Implement method
      },

      displayComponent(component) {
        console.log(`Component id is ${component}`)
        this.$router.push({ name: 'components_pending_id', params: { id: component }})
      }
    }
  }
</script>

<style scoped>
  .components-list {
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
