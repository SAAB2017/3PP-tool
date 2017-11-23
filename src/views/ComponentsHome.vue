<template>
  <div class="section components">
    <div class="columns is-mobile is-centered">
      <div class="column is-half" style="text-align: center">
          <h2 class="subtitle is-4">Components</h2>
      </div>
    </div>
    <div class="tabs is-centered">
      <ul>
        <li class="is-active" id="list" @click="tabClicked('list')"><a>Signed</a></li>
        <li id="pending" @click="tabClicked('pending')"><a>Pending</a></li>
        <li id="add" @click="tabClicked('add')"><a>Add</a></li>
      </ul>
    </div>
    <div class="columns is-mobile is-centered">
      <div v-if="active === 'list'" class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <components-list></components-list>
      </div>
      <div v-if="active === 'pending'" class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <components-sign></components-sign>
      </div>
      <div v-if="active === 'add'" class="column is-half-desktop is-three-quarters-tablet is-full-mobile">
        <components-add></components-add>
      </div>
    </div>
  </div>
</template>

<script>
  import ComponentsList from '@/components/ComponentsList'
  import ComponentsSign from '@/components/ComponentsSign'
  import ComponentsAdd from '@/components/ComponentsAdd'

  export default {
    components: {
      ComponentsList,
      ComponentsSign,
      ComponentsAdd
    },

    mounted () {
      if (this.$route.params.active) {
        this.active = this.$route.params.active
      }
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
      }
    }
  }
</script>
