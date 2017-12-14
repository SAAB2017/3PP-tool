<!-- View for showing information about and updating a project -->
<template>
  <div class="section">
        <div v-if="project" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">{{ project.projectName }}</h1>
          </div>
          <p id="p-message" class="help subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>

          <div v-if="project.approved === 0" class="columns is-mobile is-centered">
            <div class="field is-horizontal">
              <div class="control">
                <input v-model="project.approvedBy" class="input" type="text" placeholder="Signature">
              </div>
              <div class="control">
                <button @click="signProject()" class="button is-primary">Sign</button>
              </div>
            </div>
          </div>

          <!-- Columns that is centered and multiline for support on lower resolution -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Column that contains the name and version of the project. Also contains
             the update button -->
            <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Name:</label>
                </div>
                <div class="field-body">
                  <label>{{ project.projectName }}</label>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Version:</label>
                </div>
                <div class="field-body">
                  <label>{{ project.projectVersion }}</label>
                </div>
              </div>

            <!-- Column that contains the date the product was created and the signature
             for the person that approved it -->
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Created:</label>
                </div>
                <div class="field-body">
                  <label>{{ project.dateCreated }}</label>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Approver:</label>
                </div>
                <div class="field-body">
                  <label>{{ project.approvedBy }}</label>
                </div>
              </div>

              <div class="field is-grouped is-grouped-left">
                <div class="control">
                  <button @click="showLog()" class="button is-primary">Show history</button>
                </div>
              </div>
            </div>

            <!-- Column that contains the comment for the product -->
            <div class="column is-three-quarters-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea class="textarea" v-model="project.comment"></textarea>
                </div>
              </div>
              <!-- Button for updating the project values. Uses "updateComment"-function -->
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button @click="updateComment()" class="button is-primary">Update comment</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Columns that contains tables -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Table that shows which licenses is in this project -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Licenses in project</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">License</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="license in licenses" @click="displayLicense(license)">
                  <td scope="row" data-label="License">{{ license.licenseName }}</td>
                  <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which components is in this project -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Components in project</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="com in components" @click="displayComponent(com)">
                  <td scope="row" data-label="Component">{{ com.componentName }}</td>
                  <td scope="row" data-label="Version">{{ com.componentVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which products is in this project -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Products in project</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in products" @click="displayProduct(product)">
                  <td scope="row" data-label="Product">{{ product.productName }}</td>
                  <td scope="row" data-label="Version">{{ product.productVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <!-- If no product with id id is found -->
        <div v-else>
          <div class="columns">
            <div class="column is-3">
              <h1>Project not found</h1>
              <p>No project with ID {{ id }}</p>
            </div>
          </div>
        </div>

    <div class="modal" id="modalWindow">
      <div class="modal-background" @click="closeModal()"></div>
      <div class="modal-card" style="text-align: center">

        <header class="modal-card-head">
          <p class="modal-card-title"> {{ modalName }} </p>
          <button class="delete" aria-label="close" @click="closeModal()"></button>
        </header>

        <section class="modal-card-body">

          <div class="field is-horizontal" style="padding-right: 30px">
            <div class="field-label">
              <label class="label is-normal">Name</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input v-model="modalName" class="input" type="text" readonly>
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal" style="padding-right: 30px">
            <div class="field-label">
              <label class="label is-normal">Version</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input v-model="modalVersion" class="input" type="text" readonly>
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal" style="padding-right: 30px">
            <div class="field-label">
              <label class="label is-normal">Created</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input v-model="modalCreated" class="input" type="text" readonly>
                </div>
              </div>
            </div>
          </div>

          <div v-if="modalComp != 'license'" class="field is-horizontal" style="padding-right: 30px">
            <div class="field-label">
              <label class="label is-normal">Approver</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input v-model="modalApprover" class="input" type="text" readonly>
                </div>
              </div>
            </div>
          </div>

          <div v-if="modalComp === 'license'" class="field is-horizontal" style="padding-right: 30px">
            <div class="field-label">
              <label class="label is-normal">Type</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input v-model="modalType" class="input" type="text" readonly>
                </div>
              </div>
            </div>
          </div>

          <div v-if="modalComp === 'license'" class="field is-horizontal" style="padding-right: 30px">
            <div class="field-label">
              <label class="label is-normal">URL</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input v-model="modalURL" class="input" type="text" readonly>
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal" style="padding-right: 30px">
            <div class="field-label">
              <label class="label is-normal">Comment</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <textarea v-model="modalComment" class="textarea" readonly/>
                </div>
              </div>
            </div>
          </div>

        </section>

        <footer class="modal-card-foot" style="justify-content: center">
          <button @click="goTo(modalComponent)" class="button is-success">Go to {{ modalComp }} </button>
        </footer>


      </div>
    </div>

    <div class="modal" id="logWindow">
      <div class="modal-background" @click="closeLog()"></div>
      <div class="modal-card" style="text-align: center">

        <header class="modal-card-head">
          <p class="modal-card-title"> History for {{project.projectName}} </p>
          <button class="delete" aria-label="close" @click="closeLog()"></button>
        </header>

        <section class="modal-card-body vertical-menu">
          <table>
            <thead>
            <tr>
              <th scope="col" style="width: 120px">Date</th>
              <th scope="col">Event</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="logItem in logItems">
              <td scope="row" style="width: 120px" data-label="Date">{{ logItem.dateLogged }}</td>
              <td scope="row" data-label="Event">{{ logItem.note }}</td>
            </tr>
            </tbody>
          </table>

        </section>

        <footer class="modal-card-foot" style="justify-content: center">
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
        project: {},
        origComment: '',
        licenses: [],
        components: [],
        products: [],
        message: '',
        modalComponent: {},
        modalComp: '',
        modalName: '',
        modalVersion: '',
        modalCreated: '',
        modalApprover: '',
        modalComment: '',
        modalType: '',
        modalURL: '',
        logItems: []
      }
    },

    /* Fetch the project with id from database and add to project,
     * then fetch licenses, components and products
     */
    mounted () {
      axios.get(this.$baseAPI + 'projects/' + this.$route.params.id)
        .then(response => {
          this.project = response.data
          this.origComment = this.project.comment
          this.fetchLicenses()
          this.fetchComponents()
          this.fetchProducts()
          return null
        })
      let _this = this
      document.addEventListener('keyup', function (event) {
        if (event.key === 'Escape') {
          _this.closeModal()
          _this.closeLog()
        }
      })
    },

    methods: {

      getLog () {
        axios.get(this.$baseAPI + 'projects/log/' + this.$route.params.id)
          .then(response => {
            this.logItems = response.data
          })
      },

      /**
       * Fetch all licenses that is in this project
       */
      fetchLicenses () {
        axios.get(this.$baseAPI + 'licenses/licensesInProject/' + this.$route.params.id).then(response => {
          this.licenses = response.data
        })
      },

      /**
       * Fetch all components that is in this project
       */
      fetchComponents () {
        axios.get(this.$baseAPI + 'components/componentsInProject/' + this.$route.params.id).then(response => {
          this.components = response.data
        })
      },

      /**
       * Fetch all products that is in this project
       */
      fetchProducts () {
        axios.get(this.$baseAPI + 'products/productsInProject/' + this.$route.params.id).then(response => {
          this.products = response.data
        })
      },
      /**
       * Update this product with new values
       */
      updateComment () {
        let msg = document.getElementById('p-message')
        if (this.origComment === this.project.comment) {
          msg.classList.remove('is-success')
          msg.classList.add('is-danger')
          // msg.style.opacity = 1
          this.message = 'Old and new comment is the same'
          this.fade_out()
        } else {
          let data = {
            id: this.project.id,
            comment: this.project.comment
          }

          axios.post(this.$baseAPI + 'projects/comment', data)
            .then(response => {
              msg.classList.remove('is-danger')
              msg.classList.add('is-success')
             // msg.style.opacity = 1
              if (response.status === 200) {
                this.origComment = this.project.comment
                this.message = 'Comment updated'
                this.fade_out()
              }
            })
        }
      },

      /**
       * Shows this.message for some time then fades it away and removes it.
       */
      fade_out () {
        let msg = document.getElementById('p-message')
        let page = this
        let count = 1
        let fadeEffect = setInterval(function () {
          if (!msg.style.opacity) {
            msg.style.opacity = 1
          }
          if (count < 0.1) {
            page.message = ''
            msg.style.opacity = 1
            clearInterval(fadeEffect)
          } else {
            count -= 0.01
            if (count < 0.2) {
              msg.style.opacity -= 0.1
            }
          }
        }, 100)
      },

      showLog () {
        this.getLog()
        let d = document.getElementById('logWindow')
        d.classList.add('is-active')
      },

      closeLog () {
        let d = document.getElementById('logWindow')
        d.classList.remove('is-active')
      },

      showModal () {
        let d = document.getElementById('modalWindow')
        d.classList.add('is-active')
      },

      closeModal () {
        let d = document.getElementById('modalWindow')
        d.classList.remove('is-active')
        this.modalComp = ''
        this.modalName = ''
        this.modalVersion = ''
        this.modalCreated = ''
        this.modalApprover = ''
        this.modalComment = ''
        this.modalType = ''
        this.modalURL = ''
        this.modalComponent = {}
      },

      displayLicense (license) {
        this.modalComponent = license
        this.modalComp = 'license'
        this.modalName = license.licenseName
        this.modalVersion = license.licenseVersion
        this.modalCreated = license.dateCreated
        this.modalComment = license.comment
        this.modalType = license.licenseType
        this.modalURL = license.URL
        this.showModal()
      },

      displayComponent (component) {
        this.modalComponent = component
        this.modalComp = 'component'
        this.modalName = component.componentName
        this.modalVersion = component.componentVersion
        this.modalCreated = component.dateCreated
        this.modalComment = component.comment
        this.modalApprover = component.approvedBy
        this.showModal()
      },

      displayProduct (product) {
        this.modalComponent = product
        this.modalComp = 'product'
        this.modalName = product.productName
        this.modalVersion = product.productVersion
        this.modalCreated = product.dateCreated
        this.modalComment = product.comment
        this.modalApprover = product.approvedBy
        this.showModal()
      },

      signProject () {
        if (this.project.approvedBy !== '' || this.project.approvedBy) {
          let data = {
            id: this.project.id,
            approvedBy: this.project.approvedBy,
            comment: this.project.comment,
            lastEdited: new Date().toLocaleDateString()
          }
          axios.put(this.$baseAPI + 'projects/approve', data)
            .then(response => {
              if (response.status === 204) {
                this.$router.push({name: 'projects', params: {type: 'signed', sName: this.project.projectName, sVersion: this.project.projectVersion}})
              } else {
                this.message = response.data
              }
            })
            .catch(error => {
              if (error.response) {
                if (error.response.status === 500) {
                  this.message = 'Already signed by ' + error.response.data.byUser
                }
              }
            })
        } else {
          this.message = 'Invalid signature!'
        }
      },

      goTo (part) {
        let routeName = this.modalComp + 's_id'
        this.$router.push({name: routeName, params: {id: part.id}})
      }
    }
  }
</script>

<style scoped>
  .vertical-menu {
    width: 100%;
    overflow-y: auto;
    max-height: 800px;
  }
</style>
