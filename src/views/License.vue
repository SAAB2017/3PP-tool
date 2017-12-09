<!-- View for showing information about a license -->
<template>
  <div class="section">
        <div v-if="license" class="component">
          <div class="columns is-mobile is-centered">
            <h1 class="has-text-left">{{ license.componentName }}</h1>
          </div>
          <p id="p-message" class="help subtitle is-6" style="text-align: center; padding-bottom: 15px">{{ message }}</p>

          <!-- Columns that is centered and multiline for support on lower resolution -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Column that contains the name and version of the license. Also contains
             the update button -->
            <div class="column is-one-quarter-desktop is-one-third-tablet is-10-mobile">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Name:</label>
                </div>
                <div class="field-body">
                  <label>{{ license.licenseName }}</label>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Version:</label>
                </div>
                <div class="field-body">
                  <label>{{ license.licenseVersion }}</label>
                </div>
              </div>

            <!-- Column that contains the date the license was created, the license type
             and the URL for the license -->
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Created:</label>
                </div>
                <div class="field-body">
                  <label>{{ license.dateCreated }}</label>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Type:</label>
                </div>
                <div class="field-body">
                  <label>{{ license.licenseType }}</label>
                </div>
              </div>
            </div>

            <!-- Column that contains the comment for the license -->
            <div class="column is-three-quarters-desktop is-two-thirds-tablet is-10-mobile">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">URL</label>
                </div>
                <div class="field-body">
                  <input v-model="license.URL" class="input" type="text">
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label is-normal">Comment</label>
                </div>
                <div class="field-body">
                  <textarea class="textarea" v-model="license.comment"></textarea>
                </div>
              </div>
              <!-- Button for updating the license values. Uses "updateComment"-function -->
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button @click="updateLicense()" class="button is-primary">Update URL/comment</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Columns that contains tables -->
          <div class="columns is-mobile is-centered is-multiline">

            <!-- Table that shows which components this license is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Components with license</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="co in components" @click="displayComponent(co)">
                  <td scope="row" data-label="Component">{{ co.componentName }}</td>
                  <td scope="row" data-label="Version">{{ co.componentVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which products this license is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Products with license</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="produ in products" @click="displayProduct(produ)">
                  <td scope="row" data-label="Product">{{ produ.productName }}</td>
                  <td scope="row" data-label="Version">{{ produ.productVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Table that shows which projects this license is in -->
            <div class="column is-one-third-desktop is-two-thirds-tablet is-10-mobile">
              <h4>Projects with license</h4>
              <table>
                <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Version</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="projec in projects" @click="displayProject(projec)">
                  <td scope="row" data-label="Project">{{ projec.projectName }}</td>
                  <td scope="row" data-label="Version">{{ projec.projectVersion }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <!-- If no license is found -->
        <div v-else>
          <div class="columns">
            <div class="column is-3">
              <h1>License not found</h1>
              <p>No license with ID {{ id }}</p>
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

          <div class="field is-horizontal" style="padding-right: 30px">
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
        license: {},
        components: [],
        origComment: '',
        origURL: '',
        products: [],
        projects: [],
        message: '',
        modalComponent: {},
        modalComp: '',
        modalName: '',
        modalVersion: '',
        modalCreated: '',
        modalApprover: '',
        modalComment: ''
      }
    },

    /* Fetch the license with id from database and add to license,
     * then fetch components, products and projects */
    mounted () {
      axios.get(this.$baseAPI + 'licenses/' + this.$route.params.id)
        .then(response => {
          this.license = response.data
          this.origComment = this.license.comment
          this.origURL = this.license.URL
          this.fetchComponents()
          this.fetchProducts()
          this.fetchProjects()
        })
    },

    methods: {
      /**
       * Fetch all components that contains this license
       */ // TODO: WORKS
      fetchComponents () {
        axios.get(this.$baseAPI + 'components/componentsWithLicense/' + this.$route.params.id).then(response => {
          this.components = response.data
        })
      },
      // TODO:
      /**
       * Fetch all products that contains this license
       */
      fetchProducts () {
        axios.get(this.$baseAPI + 'products/productsWithLicense/' + this.$route.params.id).then(response => {
          this.products = response.data
        })
      },

      /**
       * Fetch all projects that contains this license
       */
      fetchProjects () {
        axios.get(this.$baseAPI + 'projects/projectsWithLicense/' + this.$route.params.id).then(response => {
          this.projects = response.data
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
        this.modalComponent = {}
      },

      displayComponent (component) {
        this.modalComponent = component
        this.modalComp = 'component'
        this.modalName = component.componentName
        this.modalVersion = component.componentVersion
        this.modalCreated = component.dateCreated
        this.modalComment = component.comment
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
        this.$router.push({name: routeName, params: {id: part.id}})
      },

      updateLicense () {
        let msg = document.getElementById('p-message')
        this.message = ''
        if (this.origComment === this.license.comment && this.origURL === this.license.URL) {
          msg.classList.remove('is-success')
          msg.classList.add('is-danger')
          this.message = 'Nothing to change, URL and comment not modified'
          this.fade_out()
        } else {
          msg.classList.remove('is-danger')
          msg.classList.add('is-success')
          if (this.origComment !== this.license.comment) {
            let data = {
              id: this.license.id,
              comment: this.license.comment
            }

            axios.post(this.$baseAPI + 'licenses/comment', data)
              .then(response => {
                this.origComment = this.license.comment
                if (this.message) this.message += ', '
                this.message += 'Comment updated'
              })
          }
          if (this.origURL !== this.license.URL) {
            let data = {
              id: this.license.id,
              URL: this.license.URL
            }

            axios.post(this.$baseAPI + 'licenses/URL', data)
              .then(response => {
                this.origURL = this.license.URL
                if (this.message) this.message += ', '
                this.message += 'URL updated'
              })
          }
          this.fade_out()
        }
      },

      /**
D       * Shows this.message for some time then fades it away and removes it.
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
      }
    }
  }
</script>
