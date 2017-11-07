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
        <tr v-for="product in products">
          <td style="text-align: center"><input class="checkbox" type="checkbox" id="cProductID"/></td>
          <td>{{ product.productName }}</td>
          <td>{{ product.productVersion }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchProducts" class="input" type="text" placeholder="Find a product">
      </div>
      <div class="control">
        <a @click="searchProduct" class="button is-primary">Search</a>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <textarea v-model="projectComment" class="textarea" placeholder="Comment for project"></textarea>
      </div>
    </div>


    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProject" class="button is-primary">Add project</a>
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
        projectVersion: null,
        projectComment: null
      }
    },

    mounted() {
      axios.get(this.$baseAPI + 'products')
        .then(response => {
          this.products = response.data
        })
    },

    methods: {

      addProject() {
        let data = {
          projectName: this.project,
          projectVersion: this.projectVersion,
          comment: this.componentVersion
          // TODO put products for add.
        }

        axios.post(this.$baseAPI + 'projects', data)
          .then(response => {
            if (response.data === "success") {
              this.project = null
              this.projectVersion = null
              this.projectComment = null

              axios.get(this.$baseAPI + 'projects')
                .then(response => {
                  this.project = response.data
                })
            }
          })
      },

      searchProduct(){
        // TODO implement method
      },
      // TODO Could be deleted? Or does it update the page after insert?
      displayProject(component) {
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
