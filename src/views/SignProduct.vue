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
              <input v-if="product.productVersion" v-model="product.productVersion" class="input" type="text" disabled>
              <input v-else v-model="testVersion" class="input" type="text" disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Created</label>
            <div class="control" style="width: 80%">
              <input v-if="product.dateCreated" v-model="product.dateCreated" class="input" type="text"  disabled>
              <input v-else  v-model="testDate"class="input" type="text" disabled>
            </div>
          </div>

        </div>

        <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
          <div class="field is-horizontal">
            <label class="field-label label is-normal" style="width: 20%">Comment</label>
            <div class="control" style="width: 80%">
              <textarea v-if="product.comment" class="textarea" v-model="product.comment"></textarea>
              <textarea v-else class="textarea" v-model="testComment"></textarea>
            </div>
          </div>



        </div>

        <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">

            <div class="field is-horizontal">
              <div class="vertical-menu" style="max-height: 200px">
                <table class="table is-bordered">
                  <thead>
                  <tr>
                    <th>Components</th>
                    <th width=1%>Version</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr> <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr>
                  <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
                  </tr> <tr>
                    <td>Test Name</td>
                    <td>1.0</td>
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
        message: '',
        testName: 'Test name',
        testVersion: 'Test version',
        testDate: '2017-10-04',
        testApproved: 'Nils Nilsson',
        testComment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

      }
    },

    mounted () {
      axios.get(this.$baseAPI + pendingURI + this.$route.params.id)
        .then(response => {
          if (response.status === '404') {
            console.log("Error requesting data.")
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
                console.log("Error: Could not sign product")
              }
            })
        } else {
          this.message = "Invalid signature!"
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
