<template>
  <div class="section">
    <div v-if="product" class="component">
      <div class="columns is-mobile is-centered">
        <div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">
            <h1 class="title is-2">Product {{ product.productName }}</h1>
            <h2 class="subtitle is-4">Product name here</h2>
        </div>
      </div>

      <div class="columns is-mobile is-centered is-multiline">

        <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">

          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Version</label>
            <div class="control" style="width: 80%">
              <input v-model="product.productVersion" class="input" type="text" disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Created</label>
            <div class="control" style="width: 80%">
              <input v-model="product.dateCreated" class="input" type="text"  disabled>
            </div>
          </div>

        </div>

        <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Comment</label>
            <div class="control" style="width: 80%">
              <textarea class="textarea" v-model="product.comment"></textarea>
            </div>
          </div>



        </div>

        <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">

            <div class="field is-horizontal">
              <div class="vertical-menu" style="max-height: 200px">
                <table class="table is-bordered">
                  <thead>
                  <tr>
                    <th scope="col">Components</th>
                    <th scope="col">Version</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="component in components">
                    <td scope="row" data-label="Component">{{ component.componentName }}</td>
                    <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
                  </tr>

                  </tbody>
                </table>
              </div>
            </div>


        </div>




      </div>
      <div class="columns is-mobile is-centered is-gapless">

        <div class="column is-one-third-desktop is-half-tablet is-10-mobile">
          <div class="field is-horizontal">
            <label class="field-label label is-normal">Signature</label>
            <div class="control">
              <input v-model="product.approvedBy" class="input" type="text">
            </div>
            <div class="control">
              <button @click="signProduct()" class="button is-primary">Sign</button>
            </div>
          </div>
        </div>

      </div>

      <div class="columns is-mobile is-centered">
        <p class="help is-success has-text-right subtitle is-6">{{ message }}</p>
      </div>


    </div>
    <div v-else>
      <h1>Product not found</h1>
      <p>No product with ID {{ id }}</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  const pendingURI = 'products/pending/'
  export default {

    data () {
      return {
        product: {},
        components: [],
        component: {},
        message: ''
      }
    },

    mounted () {
      axios.get(this.$baseAPI + pendingURI + this.$route.params.id)
        .then(response => {
          if (response.status === '404') {
            console.log('Error requesting data.')
          }
          this.product = response.data
        })
    },

    methods: {

      signProduct () {
        if (this.product.approvedBy !== null || this.product.approvedBy) {
          console.log(this.product.productName)
          let data = {
            id: this.product.id,
            approvedBy: this.product.approvedBy
          }
          axios.put(this.$baseAPI + 'products/pending/' + this.product.id, data)
            .then(response => {
              if (response.status === '201') {
                axios.get(this.$baseAPI + 'products/pending/' + this.product.id)
                  .then(response => {
                    this.message = 'Product signed'
                    this.product = response.data
                  })
              } else {
                console.log('Error: Could not sign product')
              }
            })
        } else {
          this.message = 'Invalid signature!'
        }
      }
    }
  }
</script>

<style>

  tbody>tr:hover {
    cursor: pointer;
  }

  .vertical-menu {
    width: 100%;
    overflow-y: auto;
  }
</style>
