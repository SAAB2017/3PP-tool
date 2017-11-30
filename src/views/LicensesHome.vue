<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-half" style="text-align: center">
        <h2 class="subtitle is-4">Licenses</h2>
      </div>
    </div>
    <div id="top-div" class="columns is-mobile is-centered">
      <div id="top-tabs" class="tabs is-centered">
        <ul>
          <li class="is-active" id="list" @click="tabClicked('list')"><a>Licenses</a></li>
          <li id="add" @click="tabClicked('add')"><a>Add</a></li>
        </ul>
      </div>
    </div>

    <div class="columns is-mobile is-centered">
      <div v-if="active === 'list'" class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <licenses-list></licenses-list>
      </div>
      <div v-if="active === 'add'" class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <licenses-add></licenses-add>
      </div>
    </div>

  </div>
</template>

<script>
  import LicensesList from '@/components/LicensesList'
  import LicensesAdd from '@/components/LicensesAdd'

  export default {
    components: {
      LicensesList,
      LicensesAdd
    },

    mounted () {
      if (this.$route.params.active) {
        this.active = this.$route.params.active
      }
      window.addEventListener('scroll', this.fix_top)
    },

    data () {
      return {
        active: 'list'
      }
    },

    methods: {
      tabClicked (tab) {
        document.getElementById(this.active).classList.remove('is-active')
        this.active = tab
        document.getElementById(tab).classList.add('is-active')
      },

      fix_top () {
        if (this.active === 'list') {
          let topdiv = document.getElementById('top-div')
          let topsearch = document.getElementById('top-search')
          let table = document.getElementById('table-div')
          let toptabs = document.getElementById('top-tabs')
          let topdist = topdiv.getBoundingClientRect().top

          if (topdist < 30) {
            if (!toptabs.classList.contains('tabs-fixed')) {
              toptabs.classList.add('tabs-fixed')
              topsearch.classList.add('search-fixed')
              table.classList.add('table-fixed')
            }
          } else {
            if (toptabs.classList.contains('tabs-fixed')) {
              toptabs.classList.remove('tabs-fixed')
              topsearch.classList.remove('search-fixed')
              table.classList.remove('table-fixed')
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .tabs-fixed {
    position: fixed;
    top: 30px;
    background-color: white;
  }
  #top-tabs {
    width: 100%;
  }
</style>
