<template>
  <div class="section">
    <div class="columns">
      <div class="column is-3">
        <div v-if="component" class="component">
          <h1 class="has-text-right">Component {{ component.id }}</h1>

          <div class="field is-horizontal">
            <label class="field-label label is-normal">Name</label>
            <div class="control">
              <input v-model="component.componentName" class="input" type="text">
            </div>
          </div>

          <div class="field is-horizontal">
            <label class="field-label label is-normal">Version</label>
            <div class="control">
              <input v-model="component.componentVersion" class="input" type="text">
            </div>
          </div>

          <p class="help is-success has-text-right">{{ message }}</p>

          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button @click="updateComponent()" class="button is-primary">Update</button>
            </div>
            <div class="control">
              <button @click="deleteComponent()" class="button is-danger">Delete</button>
            </div>
          </div>

        </div>
        <div v-else>
          <h1>Component not found</h1>
          <p>No component with ID {{ id }}</p>
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
        component: {},
        message: ''
      }
    },

    mounted () {
      axios.get(this.$baseAPI + 'components/' + this.$route.params.id)
        .then(response => {
          this.component = response.data
        })
    },

    methods: {

      updateComponent () {
        var data = {
          id: this.component.id,
          component: this.component.component,
          version: this.component.version
        }

        axios.put(this.$baseAPI + 'components/' + this.component.id, data)
          .then(response => {
            if (response.status === '201') {
              axios.get(this.$baseAPI + 'components/' + this.component.id)
                .then(response => {
                  this.message = 'Update sucessful'
                  this.component = response.data
                })
            }
          })
      },

      deleteComponent () {
        axios.delete(this.$baseAPI + 'components/' + this.component.id)
          .then(response => {
            if (response.status === '200') {
              this.$router.push({ name: 'Components' })
            }
          })
      }
    }
  }
</script>
