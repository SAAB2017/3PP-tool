<template>
  <div class="component-list">
    <div class="field">
      <p class="control">
        <input v-model="project" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="projectVersion" class="input" type="text" placeholder="Version">
      </p>
    </div>
    <div class="vertical-menu" style="max-height: 200px; height: auto">
      <table>
        <thead>
        <tr>
          <td></td>
          <th>Project</th>
          <th>Version</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <!-- TODO Add for-loop for products -->
          <td style="text-align: center"><input class="checkbox" type="checkbox" id="cProductName"/></td>
          <td>Some Product</td>
          <td>1.0</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="field" style="padding-top: 15px">
      <p class="control">
        <input v-model="searchProduct" class="input" type="text" placeholder="Search Product">
      </p>
    </div>
    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProject" class="button is-primary">Add Project</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        products: [],
        project: null,
        projectVersion: null
      }
    },

    mounted() {
      axios.get(this.$baseAPI + 'products')
        .then(response => {
          this.products = response.data
        })
    },

    methods: {

      addProjects() {
        let data = {
          project: this.project,
          version: this.projectVersion
          // TODO put products for add.
        }

        axios.post(this.$baseAPI + 'projects', data)
          .then(response => {
            if (response.data === "success") {
              this.project = null
              this.projectVersion = null

              axios.get(this.$baseAPI + 'projects')
                .then(response => {
                  this.project = response.data
                })
            }
          })
      },
      // TODO Could be deleted? Or does it update the page after insert?
      displayComponent(component) {
        this.$router.push({ name: "Project", params: { id: component.id } })
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
  .vertical-menu {
    width: 100%;
    height: 150px;
    overflow-y: auto;
  }

</style>
