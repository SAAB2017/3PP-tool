<template>
  <div id="app">
    <navbar></navbar>
    <!--sidebar></sidebar-->
    <main-content></main-content>
  </div>
</template>

<script>
  import Navbar from './components/layout/Navbar'
  import Sidebar from './components/layout/Sidebar'
  import MainContent from './components/layout/Content'

  export default {
    name: 'app',
    components: {
      // Sidebar,
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
