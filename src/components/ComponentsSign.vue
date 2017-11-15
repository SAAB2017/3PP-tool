<!-- View for showing all unsigned components -->
<template>
  <div class="components-list">
    <!-- Table that contains all unsigned components. Will grow to max-height and then
    become scrollable -->
    <div class="vertical-menu" style="max-height: 600px; min-width: 420px">
      <table class="table is-bordered">
        <thead>
        <tr>
          <th width="45%">Component</th>
          <th width=15%>Version</th>
          <th width="20%">Created</th>
          <th width="20%">Last edited</th>
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

    <!-- Field for searching for a component in the table. Uses "searchComponent"-method -->
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
    /* Fetches unsigned components from the database and puts them in components */
    mounted () {
      const pendingURI = 'components/' + JSON.stringify({approved: 0})
      axios.get(this.$baseAPI + pendingURI)
        .then(response => {
          this.components = response.data
        })
    },

    methods: {
      /**
       * Searches for unsigned components from the database matching the search-criteria
       */
      searchComponent(){
        // TODO Implement method
      },

      /**
       * Opens the view for signing a specific component with id id.
       * @param component The component to be signed
       */
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
