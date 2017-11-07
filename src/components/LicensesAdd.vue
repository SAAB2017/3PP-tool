<template>
  <div class="component-list">
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
    data() {
      return {
        license: null,
        licenseVersion: null,
        licenseType: null,
        licenseURL: null,
        licenseComment: null
      }
    },

    methods: {

      addLicense() {
        let data = {
          licenseName: this.license,
          licenseVersion: this.licenseVersion,
          licenseType: this.licenseType,
          URL: this.licenseURL,
          comment: this.licenseComment
          // TODO put components for add.
        }

        axios.post(this.$baseAPI + 'products', data)
          .then(response => {
            if (response.data === "success") {
              this.license = null
              this.licenseVersion = null
              this.licenseType = null
              this.licenseURL = null
              this.licenseComment = null

              axios.get(this.$baseAPI + 'products')
                .then(response => {
                  this.license = response.data
                })
            }
          })
      },
      // TODO Could be deleted? Or does it update the page after insert?
      displayComponent(component) {
        this.$router.push({ name: "License", params: { id: component.id } })
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
