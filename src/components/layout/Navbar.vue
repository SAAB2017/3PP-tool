<template>
  <nav class="navbar ">
    <div class="navbar-menu">
      <div class="navbar-start">
        <a class="logo" href="#">
          <img src="../../assets/Saab_logo.png">
        </a>
        <a class="navbar-item" href="#">
          Home
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link " href="#">
            Licences
          </a>
          <div class="navbar-dropdown ">
            <a class="navbar-item " href="#">
              MIT
            </a>
            <a class="navbar-item " href="#">
              Apache License 2.0
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <a class="navbar-item is-hidden-desktop-only" href="#">
          Github
        </a>
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <a class="button is-primary" href="#">
                                <span class="icon">
                                    <i class="fa fa-download"></i>
                                </span>
                <span>Download</span>
              </a>
            </p>
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
