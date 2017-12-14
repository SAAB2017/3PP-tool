d<!-- View for adding Licenses -->
<template>
  <div class="component-list">
    <div id="message-text">
      <p v-for="error in errorList" class="help is-danger subtitle is-6" style="text-align: center; padding-bottom: 2px">{{ error }}</p>
    </div>
    <!-- Fields for adding name, version, license type, URL and comment for a license-->
    <div class="field" style="padding-top: 15px">
      <p class="control">
        <input v-model="license" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="licenseVersion" class="input" type="text" placeholder="Version">
      </p>
    </div>

    <div class="field">
      <p class="control">
        <input v-model="licenseType" class="input" type="text" placeholder="License type">
      </p>
    </div>

    <div class="field">
      <p class="control">
        <input v-model="licenseURL" class="input" type="text" placeholder="License URL">
      </p>
    </div>

    <div class="field">
      <div class="control">
        <textarea v-model="licenseComment" class="textarea" placeholder="Comment for license"></textarea>
      </div>
    </div>

    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addLicense" class="button is-primary">Add License</a>
      </p>
    </div>


  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        license: null,
        licenseVersion: null,
        licenseType: null,
        licenseURL: null,
        licenseComment: null,
        errorList: [],
        success: true
      }
    },

    methods: {
      /**
       * Add a license to the database according to the fields in the view
       */
      addLicense () {
        let data = {
          licenseName: this.license,
          licenseVersion: this.licenseVersion,
          licenseType: this.licenseType,
          URL: this.licenseURL,
          comment: this.licenseComment
        }
        this.errorList = []
        this.success = true
        if (this.license === null || this.license.length === 0 || this.license === '') {
          let i = 0
          if (!this.success) {
            i = 1
          }
          this.errorList[i] = 'A name must be provided'
          this.success = false
        }
        if (this.licenseVersion === null || this.licenseVersion.length === 0 || this.licenseVersion === '') {
          let i = 0
          if (!this.success) {
            i = 1
          }
          this.errorList[i] = 'A version must be provided'
          this.success = false
        }
        if (this.success) {
          axios.post(this.$baseAPI + 'licenses/add', data)
            .then(response => {
              if (response.data === 'success') {
                this.license = null
                this.licenseVersion = null
                this.licenseType = null
                this.licenseURL = null
                this.licenseComment = null
                this.$router.go()
              } else if (response.data === 'error') {
                this.errorList = []
                this.errorList[0] = 'A license with the name "' + this.license + '" and version "' + this.licenseVersion + '" already exists.'
              }
            })
        }
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

</style>
