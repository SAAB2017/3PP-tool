<template>
  <div class="component-list">
    <div class="field">
      <p class="control">
        <input v-model="component" class="input" type="text" placeholder="Name">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input v-model="componentVersion" class="input" type="text" placeholder="Version">
      </p>
    </div>
    <div class="vertical-menu" style="max-height: 200px; height: auto">
      <table>
        <thead>
        <tr>
          <td></td>
          <th>License</th>
          <th>Version</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="license in licenses">
          <td style="text-align: center"><input class="checkbox" type="checkbox" id="cLicenseID"/></td>
          <td>{{ license.licenseName }}</td>
          <td>{{ license.licenseVersion }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="field has-addons" style="padding-top: 15px">
      <div class="control">
        <input v-model="searchLicenses" class="input" type="text" placeholder="Find a license">
      </div>
      <div class="control">
        <a @click="searchLicense" class="button is-primary">Search</a>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <textarea v-model="componentComment" class="textarea" placeholder="Comment for component"></textarea>
      </div>
    </div>


    <div style="padding-top: 15px">
      <p class="control">
        <a @click="addComponent" class="button is-primary">Add component</a>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        licenses: [],
        component: null,
        componentVersion: null,
        componentComment: null
      }
    },

    mounted() {
      axios.get(this.$baseAPI + 'licenses')
        .then(response => {
          this.licenses = response.data
        })
    },

    methods: {

      addComponent() {
        let data = {
          componentName: this.component,
          componentVersion: this.componentVersion,
          comment: this.componentComment
          // TODO put licenses for add.
        }

        axios.post(this.$baseAPI + 'components', data)
          .then(response => {
            if (response.data === "success") {
              this.component = null
              this.componentVersion = null
              this.componentComment = null

              axios.get(this.$baseAPI + 'components')
                .then(response => {
                  this.components = response.data
                })
            }
          })
      },

      searchLicense() {
        // TODO Implement method
      },
      // TODO Could be deleted? Or does it update the page after insert?
      displayComponent(component) {
        this.$router.push({ name: "Component", params: { id: component.id } })
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
