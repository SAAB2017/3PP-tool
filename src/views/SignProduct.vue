<template>
  <div class="section">
    <div v-if="product" class="product">

      <div class="columns is-mobile is-centered">
        <div class="column is-half-desktop is-two-thirds-tablet is-full-mobile">

          <h2 class="subtitle is-4" style="text-align: center">{{ product.productName }}</h2>

          <p class="help is-danger subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>

          <div class="columns is-mobile is-centered">
            <div class="field is-horizontal">
              <div class="control">
                <input v-model="product.approvedBy" class="input" type="text" placeholder="Signature">
              </div>
              <div class="control">
                <button @click="signProduct()" class="button is-primary">Sign</button>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Version</label>
            </div>
            <div class="field-body">
              <input v-model="product.productVersion" class="input" type="text" disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Created</label>
            </div>
            <div class="field-body">
              <input v-model="product.dateCreated" class="input" type="text"  disabled>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label is-normal">Comment</label>
            </div>
            <div class="field-body">
              <textarea class="textarea" v-model="product.comment" readonly></textarea>
            </div>
          </div>

          <table class="table is-bordered">
            <thead>
            <tr>
              <th scope="col">Licenses</th>
              <th scope="col">Version</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="license in licenses">
              <td scope="row" data-label="License">{{ license.licenseName }}</td>
              <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
            </tr>
            </tbody>
          </table>

        </div>
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
  export default {
    data () {
      return {
        product: {},
        licenses: [],
        license: {},
        message: ''
      }
    },

    mounted () {
      const pendingURI = 'products/product/' + this.$route.params.id
      let _this = this
      axios.get(this.$baseAPI + pendingURI)
        .then(response => {
          _this.product = response.data
          _this.fetchLicenses()
        }).catch(err => {
          console.log(err)
        })
    },

    methods: {
      fetchLicenses () {
        axios.get(this.$baseAPI + 'licenses/licensesInProduct/' + this.$route.params.id).then(response => {
          this.licenses = response.data
        })
      },

      /**
       * Approves the product and adds the approvers signature to the product
       */
      signProduct () {
        if (this.product.approvedBy !== '' || this.product.approvedBy) {
          let data = {
            id: this.product.id,
            approvedBy: this.product.approvedBy,
            comment: this.product.comment,
            lastEdited: new Date().toLocaleDateString()
          }
          axios.put(this.$baseAPI + 'products/approve', data)
            .then(response => {
              if (response.status === 204) {
                this.$router.push({name: 'products', params: {type: 'signed', sName: this.product.productName, sVersion: this.product.productVersion}})
              } else {
                this.message = response.data
              }
            })
            .catch(error => {
              if (error.response) {
                if (error.response.status === 500) {
                  this.message = 'Already signed by ' + error.response.data.byUser
                }
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
