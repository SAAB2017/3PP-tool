const NOTSIGNED = false
const SIGNED = true
const ITEMTYPES = ['component', 'license', 'product', 'project']
const DEFAULTPAYLOADSIZE = 25
const Ord = ['asc', 'desc']

function setSort (col, payload) {
  payload.sort.column = `&sort=${col}`
}

function setOrdering (dir, payload) {
  payload.sort.order = `&order=${dir}`
}

function initPayload (type) {
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
}

module.exports = [initPayload, NOTSIGNED, SIGNED, setSort, setOrdering]
