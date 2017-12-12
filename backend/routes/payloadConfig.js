const NOTSIGNED = false
const SIGNED = true

function initPayload () {
  const payload = {
    items: [],
    links: {
      prev: '',
      current: `?offset=0&amount=${3}`,
      next: `?offset=0&amount=${3}`
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
  return payload
}

module.exports = [initPayload]
