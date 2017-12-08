const ITEMTYPES = ['component', 'license', 'product', 'project']
const ord = ['asc', 'desc']

module.exports = {
  newPayload: (type) => {
    if (type === 'undefined' || type === null || type === '') {
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
  NOTSIGNED : false,
  SIGNED: true
}
