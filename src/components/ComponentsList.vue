<!-- View for showing all signed components -->
<template>
  <div class="component-list">
    <!-- Table that contains all signed components. Will grow to max-height and then
    become scrollable -->

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="control">
        <input v-on:keyup="searchComponent()" v-model="searchComponents" class="input" type="text" placeholder="Find a component">
      </div>
      <div class="control">
        <button @click="searchComponent()" class="button is-primary">Search</button>
      </div>
    </div>

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
    data () {
      return {
        components: [],
        searchComponents: null,
        component: null,
        componentVersion: null
      }
    },
    /* Fetches signed components from the database and puts them in components */
    mounted () {
      this.getAllComponents()
    },

    methods: {
      /**
       * Searches for signed components from the database matching the search-criteria
       */
      searchComponent () {
        if (this.searchComponents.length === 0) {
          this.getAllComponents()
          return
        }
        if (this.searchComponents !== 0 || this.searchComponents !== null || this.searchComponents !== '') {
          axios.get(this.$baseAPI + 'components/search/' + this.searchComponents).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.components = response.data
            } else {
              this.message = "No component found!"
            }
          })
        } else {
          this.getAllComponents()
        }
      },

      /**
       * Opens the view for a specific component with id id.
       * @param component The component to be viewed
       */
      displayComponent(component) {
        this.$router.push({ name: "components_id", params: { id: component.id } })
      },
      getAllComponents() {
        axios.get(this.$baseAPI + 'components/')
          .then(response => {
            this.components = response.data
          })
      },

      showModal() {
        let d = document.getElementById("modal")
        d.classList.add("is-active")
      },

      closeModal() {
        let d = document.getElementById("modal")
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
