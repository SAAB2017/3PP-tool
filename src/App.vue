<template>
  <div id="app">
    <navbar></navbar>
    <main-content></main-content>
  </div>
</template>

<script>
  import Navbar from './components/layout/Navbar'
  import MainContent from './components/layout/Content'

  export default {
    name: 'app',
    components: {
      Navbar,
      MainContent
    },
  }
</script>

<style>
#app {
  margin: 10px;
}
</style>
