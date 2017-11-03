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
        <tr>
          <!-- TODO Add for-loop for components -->
          <td style="text-align: center"><input class="checkbox" type="checkbox" id="cComponentName"/></td>
          <td>Some Component</td>
          <td>1.0</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="field" style="padding-top: 15px">
      <p class="control">
        <input v-model="searchComponent" class="input" type="text" placeholder="Search License">
      </p>
    </div>
    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addProduct" class="button is-primary">Add Product</a>
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
        productVersion: null
      }
    },

    mounted() {
      axios.get(this.$baseAPI + 'components')
        .then(response => {
          this.components = response.data
        })
    },

    methods: {

      addProducts() {
        let data = {
          product: this.product,
          version: this.productVersion
          // TODO put components for add.
        }

        axios.post(this.$baseAPI + 'products', data)
          .then(response => {
            if (response.data === "success") {
              this.product = null
              this.productVersion = null

              axios.get(this.$baseAPI + 'components')
                .then(response => {
                  this.product = response.data
                })
            }
          })
      },
      // TODO Could be deleted? Or does it update the page after insert?
      displayComponent(component) {
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
