<template>
  <div class="products-list">

    <div class="field has-addons columns is-mobile is-centered" style="padding-top: 15px">
      <div class="select">
        <select id="selected" v-on:change="selectChanged()">
          <option value="licenses">Licenses</option>
          <option value="components">Components</option>
          <option value="products">Products</option>
          <option value="projects" selected>Projects</option>
        </select>
      </div>
      <div class="control">
        <input v-on:keyup="search" v-model="searchQuery" class="input" type="text" placeholder="Search">
      </div>
      <div class="control">
        <button @click="search" class="button is-primary">Search</button>
      </div>
    </div>

    <table v-if="dispThing.length != 0">
      <thead>
      <tr>
        <th scope="col">{{ selectedText }}</th>
        <th scope="col">Version</th>
        <th scope="col">Created</th>
        <th scope="col">Last edited</th>
      </tr>
      </thead>
      <tbody class="tbodyhome">
      <tr v-for="comp in dispThing" @click="display(comp)">

        <td v-if="selected === 'products'" scope="row" data-label="Product">{{ comp.productName }}</td>
        <td v-if="selected === 'projects'" scope="row" data-label="Product">{{ comp.projectName }}</td>
        <td v-if="selected === 'components'" scope="row" data-label="Product">{{ comp.componentName }}</td>
        <td v-if="selected === 'licenses'" scope="row" data-label="Product">{{ comp.licenseName }}</td>
        <td v-if="selected === 'products'" scope="row" data-label="Version">{{ comp.productVersion }}</td>
        <td v-if="selected === 'projects'" scope="row" data-label="Version">{{ comp.projectVersion }}</td>
        <td v-if="selected === 'components'" scope="row" data-label="Version">{{ comp.componentVersion }}</td>
        <td v-if="selected === 'licenses'" scope="row" data-label="Version">{{ comp.licenseVersion }}</td>
        <td scope="row" data-label="Created">{{ comp.dateCreated }}</td>
        <td scope="row" data-label="Last edited">{{ comp.lastEdited }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  import payloadcfg from '../../backend/routes/config'

  export default {
    data () {
      return {
        dispThing: [],
        selected: 'projects',
        selectedText: 'Projects',
        searchQuery: null
      }
    },

    methods: {
      selectChanged () {
        let e = document.getElementById('selected')
        this.selected = e.options[e.selectedIndex].value
        this.selectedText = e.options[e.selectedIndex].text
        this.dispThing = []
        this.searchQuery = ''
      },
      /**
       * Searches for signed products from the database matching the search-criteria
       */
      search () {
        if (this.searchQuery.length === 0) {
          this.dispThing = []
          return
        }
        if (this.searchQuery !== 0 || this.searchQuery !== null || this.searchQuery !== '') {
          let query = this.selected + '/search/' + this.searchQuery
          axios.get(this.$baseAPI + query).then(response => {
            console.log(response.data)
            if (response.data != null) {
              this.dispThing = response.data
            }
          })
        } else {
          this.dispThing = []
        }
      },
      /**
       * Opens the view for a specific product with id id.
       * @param comp The product to be viewed
       */
      display (comp) {
        let push = this.selected + '_id'
        this.$router.push({ name: push, params: { id: comp.id } })
      }
    }
  }
</script>

<style scoped>
  .products-list {
    margin-bottom: 20px;
  }
  tbody>tr:hover {
    cursor: pointer;
  }
</style>
