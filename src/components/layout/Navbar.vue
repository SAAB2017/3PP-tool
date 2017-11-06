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
        <a class="navbar-item" href="/">
          Home
        </a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="/licenses">
            Licences
          </a>
          <div class="navbar-dropdown is-boxed">
            <a class="navbar-item " href="/licenses/add">
              Add License
            </a>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="/components">
            Components
          </a>
          <div class="navbar-dropdown is-boxed">
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
          <div class="navbar-dropdown is-boxed">
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
          <div class="navbar-dropdown is-boxed">
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
  document.addEventListener('DOMContentLoaded', function () {
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {

      // Add a click event on each of them
      $navbarBurgers.forEach(function ($el) {
        $el.addEventListener('click', function () {

          // Get the target from the "data-target" attribute
          var target = $el.dataset.target;
          var $target = document.getElementById(target);

          // Toggle the class on both the "navbar-burger" and the "navbar-menu"
          $el.classList.toggle('is-active');
          $target.classList.toggle('is-active');

        });
      });
    }

  });

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
