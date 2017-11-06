<template>
  <nav class="navbar ">
    <div class="navbar-menu">
      <div class="navbar-start">
        <a class="logo" href="#">
          <img src="../../assets/Saab_logo.png">
        </a>
        <a class="navbar-item" href="/">
          Home
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="/licenses">
            Licences
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item " href="/licenses/add">
              Add License
            </a>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="/components">
            Components
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item" href="/components/add">
              Add component
            </a>
            <a class="navbar-item" href="/components/pending">
              Approve component
            </a>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="/products">
            Products
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item" href="/products/add">
              Add product
            </a>
            <a class="navbar-item" href="/products/pending">
              Approve product
            </a>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="/projects">
            Projects
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item" href="/projects/add">
              Add project
            </a>
            <a class="navbar-item" href="/projects/pending">
              Approve project
            </a>
          </div>
        </div>
      </div>


    </div>
  </nav>
</template>

<script>
  export default {
    name: 'navbar',
    data() {
      return {
        menu: [{
          name: '',
          link: '',
        },
        {
          name: '',
          link: '',
        },
        {
          name: '',
          link: '',
        }]
      }
    }
  }
</script>

<style scoped>
  .navbar {
    margin-bottom: 20px;
  }

  .logo {
    padding: 10px;
    margin-top: 10px;
    margin-right: 20px;
  }
</style>
