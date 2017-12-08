const ITEMTYPES = ['component', 'license', 'product', 'project']
const ord = ['asc', 'desc']
const DEFAULTPAYLOADSIZE = 25

module.exports = {
  payloadInit: (type) => {
    if (type === 'undefined' || type === null || type === '') {
      let Error = {
        givenType: type,
        message: 'Wrong column type. Type needs to be specified explicitly'
      }
      throw Error
    }
    return {
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
  setOrder: (order) => {
    return `&order=${order}`
  },
  setSort: (sortBy)  => {
    for (let column of ITEMTYPES) {
      if (sortBy === column) {
        return `&sort=${sortBy}`
      }
    }
    console.log("Warning: wrong name for column")
    return '&sort=componentName'
  },
  setSorting: (sortBy, order) => {
    let sort = {
      column: `&sort=${sortBy}`,
      order: `&order=${order}`
    }
    return sort
  },
  setCursor: (offset, amount) => {
    let links = {
      prev: `?offset=${offset}&amount=${amount}`,
      current: `?offset=${offset}&amount=${amount}`,
      next: `?offset=${offset}&amount=${amount}`
    }
    return links
  },
  NOTSIGNED : false,
  SIGNED: true
}
