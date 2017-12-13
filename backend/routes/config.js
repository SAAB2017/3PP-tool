const ITEMTYPES = ['component', 'license', 'product', 'project']
const ORD = ['asc', 'desc']
const DEFAULTPAYLOADSIZE = 5

module.exports = {
  payloadInit: (type) => {
    if (type === 'undefined' || type === null || type === '') {
      let Error = {
        givenType: type,
        message: 'Wrong column type. Type needs to be specified explicitly'
      }
      throw Error
    }
    return { // a default payload, can/should be extended
      items: [],
      links: {
        prev: `?offset=0&amount=${DEFAULTPAYLOADSIZE}`,
        current: `?offset=0&amount=${DEFAULTPAYLOADSIZE}`,
        next: `?offset=0&amount=${DEFAULTPAYLOADSIZE}`
      },
      sort: {
        column: `&sort=${type}Name`,
        order: `&order=asc`
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
  /*    // TODO: make these functions global, then bind context to them
  getMore: (uri, replaceItemsList) => {
    if (this.searching === false) {
      this.getNext(uri, replaceItemsList)
    } else {
      this.getNextSearchQuery(uri, replaceItemsList)
    }
  },
  getNext: (uri, replaceItemsList) => {
    axios.get(this.$baseAPI + uri + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
      .then(response => {
        this.payload = response.data
        replaceItemsList ? this.products = [...this.payload.items] : this.products = [...this.products, ...this.payload.items]
        this.products.length === this.payload.meta.count ? this.showPaginatorClick = null : this.showPaginatorClick = true
      })
  },
  getNextSearchQuery: (uri, replaceItemsList) => {
    axios.get(this.$baseAPI + uri + 'search/' + this.searchProducts + '/' + this.payload.links.next + this.payload.sort.column + this.payload.sort.order)
      .then(response => {
        this.payload = response.data
        replaceItemsList ? this.products = [...this.payload.items] : this.products = [...this.products, ...this.payload.items]
        if (this.products.length === this.payload.meta.count) {
          this.showPaginatorClick = null
        } else {
          this.showPaginatorClick = true
        }
      })
  },
  */
  NOTSIGNED: false,
  SIGNED: true
}
