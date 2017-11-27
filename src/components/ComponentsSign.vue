<!-- View for showing all unsigned components -->
<template>
  <div class="components-list">
    <!-- Table that contains all unsigned components. Will grow to max-height and then
    become scrollable -->
    <table>
      <thead>
      <tr>
        <th scope="col">Component</th>
        <th scope="col">Version</th>
        <th scope="col">Created</th>
        <th scope="col">Last edited</th>
      </tr>
      </thead>
      <tbody class="tbodyhome">
      <tr v-for="component in components" @click="displayComponent(component)">
        <td scope="row" data-label="Component">{{ component.componentName }}</td>
        <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
        <td scope="row" data-label="Created">{{ component.dateCreated }}</td>
        <td scope="row" data-label="Last edited">{{ component.lastEdited }}</td>
      </tr>
      </tbody>
    </table>

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
    data () {
      return {
        components: [],
        component: null,
        componentVersion: null
      }
    },
    /* Fetches unsigned components from the database and puts them in components */
    mounted () {
      const pendingURI = 'components/pending'
      axios.get(this.$baseAPI + 'components/pending')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {
      /**
       * Searches for unsigned components from the database matching the search-criteria
       */
      searchComponent () {
        // TODO Implement method
      },

      /**
       * Opens the view for signing a specific component with id id.
       * @param component The component to be signed
       */
      displayComponent (component) {
        console.log(`Component id is ${component}`)
        this.$router.push({ name: 'components_pending_id', params: { id: component } })
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
</style>
