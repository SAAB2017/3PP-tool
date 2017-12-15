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
              <h4 style="padding-top: 50px">Licenses in project</h4>
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
              <h4 style="padding-top: 50px">Components in project</h4>
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
              <div class="field is-grouped is-grouped-left">
                <div class="control">
                  <button @click="showBind()" class="button is-primary">Bind products</button>
                </div>
              </div>
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

    <div class="modal" id="bindWindow">
      <div class="modal-background" @click="closeBind()"></div>
      <div class="modal-card" style="text-align: center">

        <header class="modal-card-head">
          <p class="modal-card-title"> Bind products to {{project.projectName}} </p>
          <button class="delete" aria-label="close" @click="closeBind()"></button>
        </header>

        <section class="modal-card-body vertical-menu">
          <table>
            <thead>
            <tr>
              <td style="width: 25px"></td>
              <th scope="col">Product</th>
              <th scope="col">Version</th>
            </tr>
            </thead>
            <tbody class="tbodyadd">
            <transition-group name="list" appear>
              <tr v-for="product in unbindedProducts" v-bind:key="product" class="plist-item">
                <td style="width: 25px"><input class="checkbox" type="checkbox" v-bind:value=product.id v-model.number="checkedProducts"></td>
                <td scope="row" data-label="Product">{{ product.productName }}</td>
                <td scope="row" data-label="Version">{{ product.productVersion }}</td>
              </tr>
            </transition-group>
            <tr v-if="showPaginatorClick">
              <div id="paginator" style="text-align: center;" @click="getMore(false)"><a class="button is-primary">Get more</a></div>
            </tr>
            </tbody>
          </table>
          <!-- Field for searching for products. Uses "searchProduct"-method for searching -->
          <div class="field has-addons" style="padding-right: 15px">
            <div class="control">
              <input v-on:keyup="searchProduct()" v-model="searchProducts" class="input" type="text" placeholder="Find a product">
            </div>
            <div class="control">
              <a @click="searchProduct()" class="button is-primary">Search</a>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot" style="justify-content: center">
          <div class="field has-addons">
            <div class="control">
              <a class="button is-primary" @click="bindProducts()">Bind product(s)</a>
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
        logItems: [],
        unbindedProducts: [],
        checkedProducts: [],
        searchProducts: '',
        showPaginatorClick: true,
        searching: false,
        payload: this.payloadInit('product'),
        productIds: []
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
        axios.get(this.$baseAPI + 'products/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
          .then(response => {
            this.payload = response.data
            replaceItemsList ? this.unbindedProducts = this.payload.items : this.unbindedProducts = this.unbindedProducts.concat(this.payload.items)
            this.unbindedProducts.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
            let temp = []
            this.unbindedProducts.forEach((comp, i) => {
              if (this.productIds.indexOf(comp.id) === -1) {
                temp.push(comp)
              }
            })
            this.unbindedProducts = temp
          }).catch(err => console.log(err))
      },
      getNextSearchQuery (replaceItemsList) {
        if (this.unbindedProducts.length < this.payload.meta.count) {
          axios.get(this.$baseAPI + 'products/search/' + this.searchProducts + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
            .then(response => {
              this.payload = response.data
              replaceItemsList ? this.unbindedProducts = [...this.payload.items] : this.unbindedProducts = [...this.unbindedProducts, ...this.payload.items]
              if (this.unbindedProducts.length === this.payload.meta.count) {
                this.showPaginatorClick = null
              } else {
                this.showPaginatorClick = true
              }
              let temp = []
              this.unbindedProducts.forEach((comp, i) => {
                if (this.productIds.indexOf(comp.id) === -1) {
                  temp.push(comp)
                }
              })
              this.unbindedProducts = temp
            }).catch(err => console.log(err))
        } else {
          this.showPaginatorClick = null
        }
      },

      searchProduct () {
        this.searching = true
        let sort = this.payload.sort
        this.payload = this.payloadInit('product')
        this.payload.sort = sort
        this.showPaginatorClick = true
        if (this.searchProducts.length === 0) {
          this.searching = false
          this.showPaginatorClick = true
          this.unbindedProducts = []
          this.getNext(true)
          return
        }
        if ((this.searchProducts.length !== 0) && (this.searchProducts !== null) && (this.searchProducts !== '')) {
          const path = 'products/search/' + this.searchProducts + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order
          axios.get(this.$baseAPI + path).then(response => {
            if (response.data != null) {
              this.payload = response.data
              this.unbindedProducts = this.payload.items
            } else {
              this.message = 'No product found!'
            }
          })
        }
      },

      bindProducts () {
        let _this = this
        let done = 0
        this.checkedProducts.forEach(function (prod, i) {
          let data = {
            projectID: _this.project.id,
            productID: prod
          }
          let query = _this.$baseAPI + 'projects/connectProductWithProject/'
          axios.post(query, data).then(() => {
            _this.closeBind()
          })
        })
      },

      showBind () {
        this.getNext(true)
        let d = document.getElementById('bindWindow')
        d.classList.add('is-active')
      },

      closeBind () {
        let d = document.getElementById('bindWindow')
        d.classList.remove('is-active')
        this.payload = this.payloadInit('product')
        this.fetchProducts()
        this.searchProducts = ''
        this.checkedProducts = []
      },

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
          this.products.forEach((prod) => {
            if (this.productIds.indexOf(prod.id) === -1) {
              this.productIds.push(prod.id)
            }
          })
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
