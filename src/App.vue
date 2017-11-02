<template>
  <div id="app">
    <img src="./assets/logo.png">
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>component</th>
          <th>version</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>{{ item.id }}</td>
          <td>{{ item.component }}</td>
          <td>{{ item.version }}</td>
        </tr>
      </tbody>
    </table>
    <router-view/>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'app',
    data () {
      return {
        items: [],
        errors: []
      }
    },
    created () {
      axios.get(this.$baseAPI + 'components')
        .then(response => {
          this.items = response.data
        }).catch(e => {
          this.errors.push(e)
        })
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
