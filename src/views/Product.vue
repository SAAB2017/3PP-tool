<!-- View for showing information about and updating a product -->
<template>
  <div class="section">
        <div v-if="product" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">{{ product.productName }}</h1>
          </div>
          <p id="p-message" class="help subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>

          <div v-if="product.approved === 0" class="columns is-mobile is-centered">
            <div class="field is-horizontal">
              <div class="control">
                <input v-model="product.approvedBy" class="input" type="text" placeholder="Signature">
              </div>
              <div class="control">
                <button @click="signProduct()" class="button is-primary">Sign</button>
              </div>
            </div>
          </div>

          <!-- Columns that is centered and multiline for support on lower resolution -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Column that contains the name and version of the product. Also contains
             the update button -->
            <div class="column is-one-quarter-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Name:</label>
                </div>
                <div class="field-body">
                  <label>{{ product.productName }}</label>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Version:</label>
                </div>
                <div class="field-body">
                  <label>{{ product.productVersion }}</label>
                </div>
              </div>

              <!-- Column that contains the date the product was created and the signature
               for the person that approved it -->
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Created:</label>
                </div>
                <div class="field-body">
                  <label>{{ product.dateCreated }}</label>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Approver:</label>
                </div>
                <div class="field-body">
                  <label>{{ product.approvedBy }}</label>
                </div>
              </div>
            </div>

            <!-- Column that contains the comment for the product -->
            <div class="column is-three-quarters-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea class="textarea" v-model="product.comment"></textarea>
                </div>
              </div>
              <!-- Button for updating the product values. Uses "updateComment"-function -->
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button @click="updateComment()" class="button is-primary">Update comment</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Columns that contains tables -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Table that shows which licenses is in this product -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Licenses in product</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">License</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="lic in licenses" @click="displayLicense(lic)">
                  <td scope="row" data-label="License">{{ lic.licenseName }}</td>
                  <td scope="row" data-label="Version">{{ lic.licenseVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which components is in this product -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Components in product</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="comp in components" @click="displayComponent(comp)">
                  <td scope="row" data-label="Component">{{ comp.componentName }}</td>
                  <td scope="row" data-label="Version">{{ comp.componentVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which projects this product is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Projects with product</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="project in projects" @click="displayProject(project)">
                  <td scope="row" data-label="Project">{{ project.projectName }}</td>
                  <td scope="row" data-label="Version">{{ project.projectVersion }}</td>
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
              <h1>Product not found</h1>
              <p>No product with ID {{ id }}</p>
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
  </div>
</template>

<script>
  import axios from 'axios'

  export default {

    data () {
      return {
        product: {},
        origComment: '',
        licenses: [],
        components: [],
        projects: [],
        message: '',
        modalComponent: {},
        modalComp: '',
        modalName: '',
        modalVersion: '',
        modalCreated: '',
        modalApprover: '',
        modalComment: '',
        modalType: '',
        modalURL: ''
      }
    },

    /* Fetch the product with id from database and add to product,
     * then fetch licenses, components and projects
     */
    mounted () {
      let _this = this
      axios.get(this.$baseAPI + 'products/product/' + this.$route.params.id)
        .then(response => {
          _this.product = response.data
          _this.origComment = this.product.comment
          _this.fetchLicenses()
          _this.fetchComponents()
          _this.fetchProjects()
          return null
        }).catch(err => {
          console.log(err)
        })
    },

    methods: {
      /**
       * Fetch all licenses that is in this product
       */
      fetchLicenses () {
        let _this = this
        axios.get(this.$baseAPI + 'licenses/licensesInProduct/' + this.$route.params.id).then(response => {
          _this.licenses = response.data
        }).catch(err => {
          console.log(err)
        })
      },

      /**
       * Fetch all components that is in this product
       */
      fetchComponents () {
        axios.get(this.$baseAPI + 'components/componentsInProduct/' + this.$route.params.id).then(response => {
          this.components = response.data
        })
      },

      /**
       * Fetch all projects that contains this product
       */
      fetchProjects () {
        axios.get(this.$baseAPI + 'projects/projectsWithProduct/' + this.$route.params.id).then(response => {
          this.projects = response.data
        })
      },
      /**
       * Update this product with new values
       */
      updateComment () {
        let msg = document.getElementById('p-message')
        if (this.origComment === this.product.comment) {
          msg.classList.remove('is-success')
          msg.classList.add('is-danger')
          // msg.style.opacity = 1
          this.message = 'Old and new comment is the same'
          this.fade_out()
        } else {
          let data = {
            id: this.product.id,
            comment: this.product.comment
          }

          axios.post(this.$baseAPI + 'products/comment', data)
            .then(response => {
              msg.classList.remove('is-danger')
              msg.classList.add('is-success')
              // msg.style.opacity = 1
              if (response.status === 200) {
                this.origComment = this.product.comment
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

      displayProject (project) {
        this.modalComponent = project
        this.modalComp = 'project'
        this.modalName = project.projectName
        this.modalVersion = project.projectVersion
        this.modalCreated = project.dateCreated
        this.modalComment = project.comment
        this.modalApprover = project.approvedBy
        this.showModal()
      },

      goTo (part) {
        let routeName = this.modalComp + 's_id'
        this.$router.push({name: routeName, params: {id: part.id}})
      },
      /**
       * Approves the product and adds the approvers signature to the product
       */
      signProduct () {
        if (this.product.approvedBy !== '' || this.product.approvedBy) {
          let data = {
            id: this.product.id,
            approvedBy: this.product.approvedBy,
            comment: this.product.comment,
            lastEdited: new Date().toLocaleDateString()
          }
          axios.put(this.$baseAPI + 'products/approve', data)
            .then(response => {
              if (response.status === 204) {
                this.$router.push({name: 'products', params: {type: 'signed', sName: this.product.productName, sVersion: this.product.productVersion}})
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
      }
    }
  }
</script>
