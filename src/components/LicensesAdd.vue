d<!-- View for adding Licenses -->
<template>
  <div class="component-list">
    <!-- Fields for adding name, version, license type, URL and comment for a license-->
    <div class="field">
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
        licenseComment: null
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
          // TODO put components for add.
        }

        axios.post(this.$baseAPI + 'licenses/add', data)
          .then(response => {
            if (response.data === 'success') {
              this.license = null
              this.licenseVersion = null
              this.licenseType = null
              this.licenseURL = null
              this.licenseComment = null
            }
          })
        this.$router.push({name: 'licenses'})
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
