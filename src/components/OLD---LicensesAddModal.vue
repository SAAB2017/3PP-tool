<!-- View for adding Licenses -->
<template>
  <div class="component-list">
    <div class="control" style="padding-top: 25px">
      <a @click="showModal()" class="button is-primary">Add license</a>
    </div>
    <div id="modal-licenses" class="modal">
      <div class="modal-background" @click="closeModal()"></div>
      <div class="modal-card" style="text-align: center">
        <header class="modal-card-head">
          <p class="modal-card-title">Add License</p>
          <button class="delete" aria-label="close" @click="closeModal()"></button>
        </header>
        <section class="modal-card-body">
          <!-- Fields for adding name, version, license type, URL and comment for a license-->
          <div class="field">
            <p class="control">
              <input v-model="license" class="input" type="text" placeholder="Name">
            </p>
          </div>
          <div class="field">
            <p class="control">
              <input v-model="licenseVersion" class="input" type="text" placeholder="Version">
            </p>
          </div>

          <div class="field">
            <p class="control">
              <input v-model="licenseType" class="input" type="text" placeholder="License type">
            </p>
          </div>

          <div class="field">
            <p class="control">
              <input v-model="licenseURL" class="input" type="text" placeholder="License URL">
            </p>
          </div>

          <div class="field">
            <div class="control">
              <textarea v-model="licenseComment" class="textarea" placeholder="Comment for license"></textarea>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot" style="justify-content: center">
          <button @click="addLicense()" class="button is-success">Add License</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        license: null,
        licenseVersion: null,
        licenseType: null,
        licenseURL: null,
        licenseComment: null
      }
    },

    mounted () {
      let vm = this
      document.addEventListener('keyup', function (event) {
        if (event.key === 'Escape') {
          vm.closeModal()
        }
      })
    },

    methods: {
      /**
       * Add a license to the database according to the fields in the view
       */
      addLicense () {
        let data = {
          licenseName: this.license,
          licenseVersion: this.licenseVersion,
          licenseType: this.licenseType,
          URL: this.licenseURL,
          comment: this.licenseComment
          // TODO put components for add.
        }

        axios.post(this.$baseAPI + 'licenses/add', data)
          .then(response => {
            if (response.data === 'success') {
              this.license = null
              this.licenseVersion = null
              this.licenseType = null
              this.licenseURL = null
              this.licenseComment = null
            }
          })
        this.closeModal()
        location.reload()
      },

      showModal () {
        let d = document.getElementById('modal-licenses')
        d.classList.add('is-active')
      },

      closeModal () {
        let d = document.getElementById('modal-licenses')
        d.classList.remove('is-active')
      }
    }
  }
</script>

<style scoped>
  .component-list {
    margin-bottom: 30px;
  }

  tbody>tr:hover {
    cursor: pointer;
  }

</style>
