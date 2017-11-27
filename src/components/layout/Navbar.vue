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
      <div class="navbar-start" @click="closeNavBar()">
        <router-link :to="{ name: 'home'}" class="navbar-item">Home</router-link>
        <router-link :to="{ name: 'licenses'}" class="navbar-item">Licences</router-link>
        <router-link :to="{ name: 'components'}" class="navbar-item">Components</router-link>
        <router-link :to="{ name: 'products'}" class="navbar-item">Products</router-link>
        <router-link :to="{ name: 'projects'}" class="navbar-item">Projects</router-link>
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
    },

    methods: {
      closeNavBar () {
        let navbar = document.getElementById('the-nav-bar')
        navbar.classList.remove('is-active')
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
