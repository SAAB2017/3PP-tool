<!-- View for showing all signed components -->
<template>
  <div class="component-list">
    <!-- Table that contains all signed components. Will grow to max-height and then
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
        <tbody>
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
        <input v-on:keydown.enter="searchComponent()" v-model="searchComponents" class="input" type="text" placeholder="Find a component">
      </div>
      <div class="control">
        <button @click="searchComponent()" class="button is-primary">Search</button>
      </div>
    </div>

    <div class="columns is-mobile is-centered">
      <components-add-modal></components-add-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import ComponentsAddModal from '@/components/ComponentsAddModal'

  export default {
    components: {
      ComponentsAddModal
    },
    data() {
      return {
        components: [],
        searchcomponents: null,
        component: null,
        componentVersion: null
      }
    },
    /* Fetches signed components from the database and puts them in components */
    mounted() {
      axios.get(this.$baseAPI + 'components/')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {
      /**
       * Searches for signed components from the database matching the search-criteria
       */
      searchComponent (param) {
        if (param != 0 || param != null) {
          axios.get(this.$baseAPI + 'components/search/' + this.searchComponents).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.components = response.data
            } else {
              this.message = "No component found!"
            }
          })
        }
      },

      /**
       * Opens the view for a specific component with id id.
       * @param component The component to be viewed
       */
      displayComponent(component) {
        this.$router.push({ name: "components_id", params: { id: component.id } })
      },

      showModal() {
        var d = document.getElementById("modal")
        d.classList.add("is-active")
      },

      closeModal() {
        var d = document.getElementById("modal")
        d.classList.remove("is-active")
      }
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
</style>
