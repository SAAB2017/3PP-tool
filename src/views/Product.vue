<template>
  <div class="section">
        <div v-if="product" class="component">
          <h1 class="has-text-left">Product {{ product.id }}</h1>
          <div class="columns">
            <div class="column is-12">
              <div class="columns">


                <div class="column is-3">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Name</label>
                    <div class="control">
                      <input v-if="product.productName" v-model="product.productName" class="input" type="text">
                      <input v-else class="input" type="text" v-model="testName">
                    </div>
                  </div>

                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Version</label>
                    <div class="control">
                      <input v-if="product.productVersion" v-model="product.productVersion" class="input" type="text">
                      <input v-else v-model="testVersion" class="input" type="text" >
                    </div>
                  </div>
                  <p class="help is-success has-text-right">{{ message }}</p>

                  <div class="field is-grouped is-grouped-right">
                    <div class="control">
                      <button @click="updateProduct()" class="button is-primary">Update</button>
                    </div>
                  </div>
                </div>


                <div class="column is-3">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Created</label><label style="color: transparent">h</label>
                    <div class="control">
                      <input v-if="product.dateCreated" v-model="product.dateCreated" class="input" type="text"  disabled>
                      <input v-else  v-model="testDate"class="input" type="text" disabled>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Approver</label>
                    <div class="control">
                      <input v-if="product.approvedBy" v-model="product.approvedBy" class="input" type="text" disabled>
                      <input v-else v-model="testApproved" class="input" type="text" disabled>
                    </div>
                  </div>
                </div>

                <div class="column">
                  <div class="field is-horizontal">
                    <label class="field-label label is-normal">Comment</label>
                    <div class="control" style="width: 100%">
                      <textarea v-if="product.comment" class="textarea" v-model="product.comment"></textarea>
                      <textarea v-else class="textarea" v-model="testComment"></textarea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="columns">
            <div class="column is-one-third">
              <!-- TODO Fix for-loops -->
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Licenses in product</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Test Name</td>
                  <td>1.0</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="column is-one-third">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Components in product</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Test Name</td>
                  <td>1.0</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="column is-one-third">
              <table class="table is-bordered">
                <thead>
                <tr>
                  <th>Product in projects</th>
                  <th width=1%>Version</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Test Name</td>
                  <td>1.0</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <div v-else>
          <div class="columns">
            <div class="column is-3">
              <h1>Product not found</h1>
              <p>No product with ID {{ id }}</p>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
  import axios from 'axios'

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
      axios.get(this.$baseAPI + 'products/' + this.$route.params.id)
        .then(response => {
          this.product = response.data
        })
    },

    methods: {

      updateProduct () {
        var data = {
          id: this.product.id,
          component: this.product.component,
          version: this.product.version,
          comment: this.product.comment
        }

        axios.put(this.$baseAPI + 'products/' + this.product.id, data)
          .then(response => {
            if (response.status === '201') {
              axios.get(this.$baseAPI + 'product/' + this.product.id)
                .then(response => {
                  this.message = 'Update sucessful'
                  this.product = response.data
                })
            }
          })
      }
    }
  }
</script>
