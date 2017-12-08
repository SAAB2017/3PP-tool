const NOTSIGNED = false
const SIGNED = true
const ITEMTYPES = ['component', 'license', 'product', 'project']

const Ord = ['asc', 'desc']

function setSort (col, payload) {
  payload.sort.column = `&sort=${col}`
}

function setOrdering (dir, payload) {
  payload.sort.order = `&order=${dir}`
}

function initPayload (type) {
  if (type === 'undefined') {
    let Error = {
      givenType: type,
      message: 'Wrong column type. Type needs to be specified explicitly'
    }
    throw Error
  }
  console.log("WTF MOTFHERUC!=!!=!==!")
  return {
    items: [],
    links: {
      prev: '',
      current: `?offset=0&amount=${3}`,
      next: `?offset=0&amount=${3}`
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
    getDefaultAmount: function () {
      return 25
    },
    errorflag: false
  }
}

module.exports = [initPayload, NOTSIGNED, SIGNED, setSort, setOrdering]
