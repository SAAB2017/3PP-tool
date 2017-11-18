<!-- View for adding Projects -->
<template>
  <div class="component-list">
    <div class="control" style="padding-top: 25px">
      <a @click="showModal()" class="button is-primary">Add project</a>
    </div>
    <div id="modal-projects" class="modal">
      <div class="modal-background" @click="closeModal()"></div>
      <div class="modal-card" style="text-align: center">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Project</p>
          <button class="delete" aria-label="close" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body">

          <!-- Fields for adding name and version to the project -->
          <div class="field">
            <p class="control">
              <input v-model="projectName" class="input" type="text" placeholder="Name">
            </p>
          </div>
          <div class="field">
            <p class="control">
              <input v-model="projectVersion" class="input" type="text" placeholder="Version">
            </p>
          </div>

          <!-- Table for picking products to bind to the project. Shows all approved
          products but becomes scrollable after reaching max-size -->
            <table>
              <thead>
              <tr>
                <td style="width: 25px"></td>
                <th scope="col">Project</th>
                <th scope="col">Version</th>
              </tr>
              </thead>
              <tbody class="tbodyadd">
              <tr v-for="product in products">
                <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=product.id v-model.number="checkedProducts"></td>
                <td scope="row" data-label="Product">{{ product.productName }}</td>
                <td scope="row" data-label="Version">{{ product.productVersion }}</td>
              </tr>
              </tbody>
            </table>
          <!-- Field for searching for products. Uses "searchProduct"-method for searching -->
          <div class="field has-addons" style="padding-top: 15px">
            <div class="control">
              <input v-model="searchProducts" class="input" type="text" placeholder="Find a product">
            </div>
            <div class="control">
              <a @click="searchProduct" class="button is-primary">Search</a>
            </div>
          </div>

          <!-- Textarea for adding a comment to the project -->
          <div class="field">
            <div class="control">
              <textarea v-model="projectComment" class="textarea" placeholder="Comment for project"></textarea>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot" style="justify-content: center">
          <button @click="addProject()" class="button is-success">Add Project</button>
        </footer>

      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        products: [],
        checkedProducts: [],
        projectName: '',
        projectVersion: '',
        projectComment: ''
      }
    },
    /* Fetches products from the database and puts them in products */
    mounted() {
      let vm = this
      document.addEventListener('keyup', function (event) {
        if (event.key == 'Escape'){
          vm.closeModal()
        }
      })
      axios.get(this.$baseAPI + 'products')
        .then(response => {
          this.products = response.data
        })
    },

    methods: {
      /**
       * Add a project to the database according to the fields in the view
       */
      addProject() {
        let data = {
          projectName: this.projectName,
          projectVersion: this.projectVersion,
          comment: this.projectComment,
          products: this.checkedProducts
        }

        axios.post(this.$baseAPI + 'projects/add', data)
          .then(response => {
            if (response.responseData.status === "success") {
              this.projectName = ''
              this.projectVersion = ''
              this.projectComment = ''
              this.checkedProducts = []
            }
          })
        this.closeModal()
        location.reload()
      },

      /**
       * Searches for products from the database matching the search-criteria
       */
      searchProduct(){
        // TODO implement method
      },

      showModal() {
        var d = document.getElementById("modal-projects")
        d.classList.add("is-active")
      },

      closeModal() {
        var d = document.getElementById("modal-projects")
        d.classList.remove("is-active")
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
