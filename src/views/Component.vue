<!-- View for showing information about and updating a component -->
<template>
  <div class="section">
        <div v-if="component" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">Component {{ component.id }}</h1>
          </div>

          <!-- Columns that is centered and multiline for support on lower resolution -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Column that contains the name and version of the component. Also contains
             the update button -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Name</label>
                <div class="control">
                  <input v-model="component.componentName" class="input" type="text">
                </div>
              </div>

              <div class="field is-horizontal">
                <label class="field-label label is-normal">Version</label>
                <div class="control">
                  <input v-model="component.componentVersion" class="input" type="text">
                </div>
              </div>
              <p class="help is-success has-text-right">{{ message }}</p>
            </div>

            <!-- Column that contains the date the component was created and the signature
            for the person that approved it -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-5-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Created</label>
                <div class="control">
                  <input v-model="component.dateCreated" class="input" type="text"  readonly>
                </div>
              </div>
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Approver</label>
                <div class="control">
                  <input v-model="component.approvedBy" class="input" type="text" readonly>
                </div>
              </div>
            </div>

            <!-- Column that contains the comment for the component -->
            <div class="column is-half-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <label class="field-label label is-normal">Comment</label>
                <div class="control" style="width: 100%">
                  <textarea class="textarea" v-model="component.comment"></textarea>
                </div>
              </div>
              <!-- Button for updating the component values. Uses "updateComponent"-function -->
              <div class="field is-grouped is-grouped-centered">
                <div class="control">
                  <button @click="updateComponent()" class="button is-primary">Update</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Columns that contains tables -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Table that shows which licenses is in this component -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Licenses in component</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="license in licenses" @click="displayLicense(license)">
                  <td scope="row" data-label="License"> {{ license.licenseName }}</td>
                  <td scope="row" data-label="Version">{{ license.licenseVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which products this component is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Products with component</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="p in products" @click="displayProduct(p)">
                  <td scope="row" data-label="License"> {{ p.productName }}</td>
                  <td scope="row" data-label="Version">{{ p.productVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which projects this components is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <table>
                <thead>
                <tr>
                  <th scope="col">Projects with component</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="pro in projects" @click="displayProject(pro)">
                  <td scope="row" data-label="License"> {{ pro.projectName }}</td>
                  <td scope="row" data-label="Version">{{ pro.projectVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <!-- If no component with id id is found -->
        <div v-else>
          <div class="columns">
            <div class="column is-3">
              <h1>Component not found</h1>
              <p>No component with ID {{ id }}</p>
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
        component: {},
        licenses: [],
        products: [],
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

    /* Fetch the component with id from database and add to component,
     * then fetch licenses, components and products
     */
    mounted () {
      axios.get(this.$baseAPI + 'components/' + this.$route.params.id)
        .then(response => {
          this.component = response.data
          this.fetchLicenses()
          this.fetchProducts()
          this.fetchProjects()
        })
    },

    methods: {
      /**
       * Fetch all licenses that is in this component
       */
      fetchLicenses () {
        axios.get(this.$baseAPI + 'licenses/licensesInComponent/' + this.$route.params.id).then(response => {
          this.licenses = response.data
        })
      },

      /**
       * Fetch all products that contains this component
       */
      fetchProducts () {
        axios.get(this.$baseAPI + 'products/productsWithComponent/' + this.$route.params.id).then(response => {
          this.products = response.data
        })
      },

      /**
       * Fetch all project that contains this component
       */
      fetchProjects () {
        axios.get(this.$baseAPI + 'projects/projectsWithComponent/' + this.$route.params.id).then(response => {
          this.projects = response.data
        })
      },
      /**
       * Update this component with new values
       */
      updateComponent () {
        let data = {
          id: this.component.id,
          component: this.component,
          version: this.component.version,
          comment: this.component.comment
        }

        axios.put(this.$baseAPI + 'components/' + this.component.id, data)
          .then(response => {
            if (response.status === '201') {
              axios.get(this.$baseAPI + 'components/' + this.component.id)
                .then(response => {
                  this.message = 'Update sucessful'
                  this.component = response.data
                })
            }
          })
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
        // TODO If-else temporary until licenses.js updated (row 92, in /licensesInComponent/:id, SELECT licenseID, ... should be SELECT licenseID as id)
        if (routeName === 'licenses_id'){
          this.$router.push({ name: routeName, params: { id: part.licenseID } })
        } else {
          this.$router.push({name: routeName, params: {id: part.id}})
        }
      }
    }
  }
</script>
