<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../../assets/Saab_logo.png">
      </a>
      <div class="navbar-burger burger" data-target="the-nav-bar">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>


    <div id="the-nav-bar" class="navbar-menu">
      <div class="navbar-start">
        <router-link :to="{ name: 'home'}" class="navbar-item">Home</router-link>
        <div class="navbar-item has-dropdown is-hoverable">
          <router-link :to="{ name: 'licenses'}" class="navbar-link">Licences</router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link :to="{ name: 'licenses_add'}" class="navbar-item">Add License</router-link>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable">
          <router-link :to="{ name: 'components'}" class="navbar-link">Components</router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link :to="{ name: 'components_add'}" class="navbar-item">Add component</router-link>
            <router-link :to="{ name: 'components_pending'}" class="navbar-item">Approve component</router-link>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable">
          <router-link :to="{ name: 'products'}" class="navbar-link">Products</router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link :to="{ name: 'products_add'}" class="navbar-item">Add product</router-link>
            <router-link :to="{ name: 'products_pending'}" class="navbar-item">Approve product</router-link>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable">
          <router-link :to="{ name: 'projects'}" class="navbar-link">Projects</router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link :to="{ name: 'projects_add'}" class="navbar-item">Add project</router-link>
            <router-link :to="{ name: 'projects_pending'}" class="navbar-item">Approve project</router-link>
          </div>
        </div>
      </div>


    </div>
  </nav>
</template>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach(function ($el) {
        $el.addEventListener('click', function () {
          // Get the target from the "data-target" attribute
          let target = $el.dataset.target
          let $target = document.getElementById(target)

          // Toggle the class on both the "navbar-burger" and the "navbar-menu"
          $el.classList.toggle('is-active')
          $target.classList.toggle('is-active')
        })
      })
    }
  })

  export default {
    name: 'navbar',
    data () {
      return {
        menu: [{
          name: '',
          link: ''
        },
        {
          name: '',
          link: ''
        },
        {
          name: '',
          link: ''
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
