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
              <h4 style="padding-top: 50px">Licenses in product</h4>
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
              <div class="field is-grouped is-grouped-left">
                <div class="control">
                  <button @click="showBind()" class="button is-primary">Bind components</button>
                </div>
              </div>
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
              <h4 style="padding-top: 50px">Projects with product</h4>
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

    <div class="modal" id="logWindow">
      <div class="modal-background" @click="closeLog()"></div>
      <div class="modal-card" style="text-align: center">

        <header class="modal-card-head">
          <p class="modal-card-title"> History for {{product.productName}} </p>
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

    <div class="modal" id="bindWindow">
      <div class="modal-background" @click="closeBind()"></div>
      <div class="modal-card" style="text-align: center">

        <header class="modal-card-head">
          <p class="modal-card-title"> Bind components to {{product.productName}} </p>
          <button class="delete" aria-label="close" @click="closeBind()"></button>
        </header>

        <section class="modal-card-body vertical-menu">
          <table>
            <thead>
            <tr>
              <td style="width: 25px"></td>
              <th scope="col">Component</th>
              <th scope="col">Version</th>
            </tr>
            </thead>
            <tbody class="tbodyadd">
            <transition-group name="list" appear>
              <tr v-for="component in unbindedComponents" v-bind:key="component" class="plist-item">
                <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=component.id v-model.number="checkedComponents"></td>
                <td scope="row" data-label="Component">{{ component.componentName }}</td>
                <td scope="row" data-label="Version">{{ component.componentVersion }}</td>
              </tr>
            </transition-group>
            <tr v-if="showPaginatorClick">
              <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Get more</a></div>
            </tr>
            </tbody>
          </table>
          <!-- Field for searching for components. Uses "searchComponent"-method for searching -->
          <div class="field has-addons" style="padding-right: 15px">
            <div class="control">
              <input v-on:keyup="searchComponent()" v-model="searchComponents" class="input" type="text" placeholder="Find a component">
            </div>
            <div class="control">
              <a @click="searchComponent()" class="button is-primary">Search</a>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot" style="justify-content: center">
          <div class="field has-addons">
            <div class="control">
              <a class="button is-primary" @click="bindComponents()">Bind component(s)</a>
            </div>
          </div>
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
        modalURL: '',
        logItems: [],
        unbindedComponents: [],
        checkedComponents: [],
        searchComponents: '',
        showPaginatorClick: true,
        searching: false,
        payload: this.payloadInit('component'),
        componentIds: []
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

      document.addEventListener('keyup', function (event) {
        if (event.key === 'Escape') {
          _this.closeModal()
          _this.closeLog()
          _this.closeBind()
        }
      })
    },

    methods: {

      payloadInit(type) {
        return { // a default payload, can/should be extended
          items: [],
          links: {
            prev: '?offset=0&amount=' + 25,
            current: '?offset=0&amount=' + 25,
            next: '?offset=0&amount=' + 25
          },
          sort: {
            column: '&sort=' + type + 'Name',
            order: '&order=asc'
          },
          meta: {
            current: 0,
            count: 0
          },
          errors: {
            message: [],
            status: 'OK'
          },
          errorflag: false
        }
      },
      // GET METHODS
      getMore (replaceItemsList) {
        if (this.searching === false) {
          this.getNext(replaceItemsList)
        } else {
          this.getNextSearchQuery(replaceItemsList)
        }
      },
      getNext (replaceItemsList) {
        axios.get(this.$baseAPI + 'components/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.unbindedComponents = this.payload.items : this.unbindedComponents = this.unbindedComponents.concat(this.payload.items)
            this.unbindedComponents.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
            let temp = []
            this.unbindedComponents.forEach((comp, i) => {
              if (!this.componentIds.includes(comp.id)) {
                temp.push(comp)
              }
            })
            this.unbindedComponents = temp
          }).catch(err => console.log(err))
      },
      getNextSearchQuery (replaceItemsList) {
        if (this.unbindedComponents.length < this.payload.meta.count) {
          axios.get(this.$baseAPI + 'components/search/' + this.searchComponents + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
            .then(response => {
              this.payload = response.data
              replaceItemsList ? this.unbindedComponents = [...this.payload.items] : this.unbindedComponents = [...this.unbindedComponents, ...this.payload.items]
              if (this.unbindedComponents.length === this.payload.meta.count) {
                this.showPaginatorClick = null
              } else {
                this.showPaginatorClick = true
              }
              let temp = []
              this.unbindedComponents.forEach((comp, i) => {
                if (!this.componentIds.includes(comp.id)) {
                  temp.push(comp)
                }
              })
              this.unbindedComponents = temp
            }).catch(err => console.log(err))
        } else {
          this.showPaginatorClick = null
        }
      },

      searchComponent () {
        this.searching = true
        let sort = this.payload.sort
        this.payload = this.payloadInit('component')
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchComponents.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.unbindedComponents = []
          this.getNext(true)
          return
        }
        if ((this.searchComponents.length !== 0) && (this.searchComponents !== null) && (this.searchComponents !== '')) {
          const path = 'components/search/' + this.searchComponents + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
          axios.get(this.$baseAPI + path).then(response => {
            if (response.data != null) {
              this.payload = response.data
              this.unbindedComponents = this.payload.items
            } else {
              this.message = 'No component found!'
            }
          })
        }
      },

      bindComponents () {
        let _this = this
        this.checkedComponents.forEach(function (comp) {
          let data = {
            productID: _this.product.id,
            componentID: comp
          }
          let query = _this.$baseAPI + `products/connectComponentWithProduct/`
          axios.post(query, data)
        })
        this.$router.go()
      },

      showBind () {
        this.getNext(true)
        let d = document.getElementById('bindWindow')
        d.classList.add('is-active')
      },

      closeBind () {
        let d = document.getElementById('bindWindow')
        d.classList.remove('is-active')
        this.payload = this.payloadInit('component')
        this.fetchComponents()
        this.searchComponents = ''
      },

      getLog () {
        axios.get(this.$baseAPI + 'products/log/' + this.$route.params.id)
          .then(response => {
            this.logItems = response.data
          })
      },

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
          this.components.forEach((comp) => {
            this.componentIds.push(comp.id)
          })
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

<style scoped>
  .vertical-menu {
    width: 100%;
    overflow-y: auto;
    max-height: 800px;
  }
</style>
