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
        <tr>
          <!-- TODO Add for-loop for licenses -->
          <td style="text-align: center"><input class="checkbox" type="checkbox" id="cLicenseName"/></td>
          <td>Some License</td>
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
        componentVersion: null
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
          component: this.component,
          version: this.componentVersion
          // TODO put licenses for add.
        }

        axios.post(this.$baseAPI + 'components', data)
          .then(response => {
            if (response.data === "success") {
              this.component = null
              this.componentVersion = null

              axios.get(this.$baseAPI + 'components')
                .then(response => {
                  this.components = response.data
                })
            }
          })
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
