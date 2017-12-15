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
        prev: '?offset=0&amount=' + DEFAULTPAYLOADSIZE,
        current: '?offset=0&amount=' + DEFAULTPAYLOADSIZE,
        next: '?offset=0&amount=' + DEFAULTPAYLOADSIZE
      },
      sort: {
        column: '&sort=' + type + 'Name',
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
  NOTSIGNED: false,
  SIGNED: true
}
