<template>
  <div class="component-list">
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
    <div class="vertical-menu" style="max-height: 200px; height: auto">
      <table>
        <thead>
        <tr>
          <td></td>
          <th>Component</th>
          <th>Version</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="component in components">
          <td style="text-align: center"><input class="checkbox" type="checkbox" id="cComponentID"/></td>
          <td>{{ component.componentName }}</td>
          <td>{{ component.componentVersion }}</td>
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

    <div class="field">
      <div class="control">
        <textarea v-model="productComment" class="textarea" placeholder="Comment for product"></textarea>
      </div>
    </div>


    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProduct" class="button is-primary">Add product</a>
      </p>
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

    mounted() {
      axios.get(this.$baseAPI + 'components')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {

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
      },

      searchComponent(){
        // TODO Implement method
      },
      // TODO Could be deleted? Or does it update the page after insert?
      displayProject(component) {
        this.$router.push({ name: "Product", params: { id: component.id } })
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
