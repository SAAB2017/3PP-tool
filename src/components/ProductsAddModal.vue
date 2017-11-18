<!-- View for adding Products -->
<template>
  <div class="component-list">
    <div class="control" style="padding-top: 25px">
      <a @click="showModal()" class="button is-primary">Add product</a>
    </div>
    <div id="modal-products" class="modal">
      <div class="modal-background" @click="closeModal()"></div>
      <div class="modal-card" style="text-align: center">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Product</p>
          <button class="delete" aria-label="close" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body">
          <!-- Fields for adding name and version to the product -->
          <div class="field">
            <p class="control">
              <input v-model="product" class="input" type="text" placeholder="Name">
            </p>
          </div>
          <div class="field">
            <p class="control">
              <input v-model="productVersion" class="input" type="text" placeholder="Version">
            </p>
          </div>

          <!-- Table for picking components to bind to the product. Shows all approved
          components but becomes scrollable after reaching max-size (because of class="vertical-menu") -->
            <table>
              <thead>
              <tr>
                <td style="width: 25px"></td>
                <th scope="col">Component</th>
                <th scope="col">Version</th>
              </tr>
              </thead>
              <tbody class="tbodyadd">
              <tr v-for="component in components">
                <td style="width: 25px"><input class="checkbox" type="checkbox" id="cComponentID"/></td>
                <td scope="row" data-label="Component">{{ component.componentName }}</td>
                <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
              </tr>
              </tbody>
            </table>
          <!-- Field for searching for components. Uses "searchComponent"-method for searching -->
          <div class="field has-addons" style="padding-top: 15px">
            <div class="control">
              <input v-model="searchComponents" class="input" type="text" placeholder="Find a component">
            </div>
            <div class="control">
              <a @click="searchComponent" class="button is-primary">Search</a>
            </div>
          </div>

          <!-- Textarea for adding a comment to the product -->
          <div class="field">
            <div class="control">
              <textarea v-model="productComment" class="textarea" placeholder="Comment for product"></textarea>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot" style="justify-content: center">
          <button @click="addProduct()" class="button is-success">Add Product</button>
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
        components: [],
        product: null,
        productVersion: null,
        productComment: null
      }
    },
    /* Fetches components from the database and puts them in components */
    mounted() {
      let vm = this
      document.addEventListener('keyup', function (event) {
        if (event.key == 'Escape'){
          vm.closeModal()
        }
      })
      axios.get(this.$baseAPI + 'components')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {
      /**
       * Add a product to the database according to the fields in the view
       */
      addProduct() {
        let data = {
          productName: this.product,
          productVersion: this.productVersion,
          comment: this.productComment
          // TODO put components for add.
        }

        axios.post(this.$baseAPI + 'products', data)
          .then(response => {
            if (response.data === "success") {
              this.product = null
              this.productVersion = null
              this.productComment = null

              axios.get(this.$baseAPI + 'products')
                .then(response => {
                  this.product = response.data
                })
            }
          })
        this.closeModal()
        location.reload()
      },

      /**
       * Searches for liceses from the database matching the search-criteria
       */
      searchComponent(){
        // TODO Implement method
      },

      showModal() {
        var d = document.getElementById("modal-products")
        d.classList.add("is-active")
      },

      closeModal() {
        var d = document.getElementById("modal-products")
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
