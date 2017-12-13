let payloadcfg = require('./config')
let express = require('express')
let router = express.Router()

let initPayload = payloadcfg.payloadInit.bind(null, 'product')
let NOTSIGNED = payloadcfg.NOTSIGNED
let SIGNED = payloadcfg.SIGNED

// ----------------------------------------------------------------------------
//  Methods for /products
// ----------------------------------------------------------------------------
function handleSearchGetRequest (req, res, isPending) {
  // precondition: parameter is wellformed
  let response = initPayload()
  const offset = parseInt(+req.query.offset) || 0
  const amount = parseInt(+req.query.amount) || 5
  const approved = isPending ? 1 : 0
  let sorting = (req.query.sort === 'undefined') ? `productName` : `${req.query.sort}`
  let ordering = (req.query.order === 'undefined') ? `asc` : `${req.query.order}`
  let sort = {column: `&sort=${sorting}`, order: `&order=${ordering}`}
  response.sort = sort

  getLinkData(req.db, offset, amount, response, `select count(*) as count from products where productName LIKE '%${req.params.id}%' AND approved=${approved}`, (links) => {
    response.links = {
      prev: `?offset=${links.prev}&amount=${amount}`,
      current: `?offset=${links.current}&amount=${amount}`,
      next: `?offset=${links.next}&amount=${amount}`
    }

    if (!response.errorflag) {
    // since req.query.offset and amount has been passed through parseInt, isNan and isSafeNumber, errorFlag is not set
      const query = `SELECT * FROM products where productName LIKE '%${req.params.id}%' AND approved='${approved}' order by ${sorting} ${ordering} LIMIT ${offset}, ${amount}`
      req.db.all(query, (err, rows) => {
        if (err) {
          let errormessage = 'ERROR! error message:' + err.message + ', query: ' + query
          response.errors.message = [errormessage]
          response.errors.status = 'ERROR'
          response.errors.errorflag = true
          res.status(404)
          res.json(response)
        } else {
          response.items = rows
          res.status(200)
          response.errors.status = 'OK' // FIXME: Perhaps not a necessary attribute ?
          res.json(response)
        }
      })
    }
  })
}

// ===========================
// Methodds for searching
// ===========================
router.route('/search/:id')
  .get((req, res) => {
    handleSearchGetRequest(req, res, SIGNED)
  })

router.route('/pending/search/:id').get((req, res) => {
  handleSearchGetRequest(req, res, NOTSIGNED)
})

router.route('/pending/:id').get((req, res) => {
  handleSearchGetRequest(req, res, NOTSIGNED)
})
// ----------------------------------------------------------------------------
//  Methods for /components
// ----------------------------------------------------------------------------
/**
 * setLinksCB is a call back
 * @param db - the sqlite3 database to connect to
 * @param offset - offset into the database table
 * @param amount - amount of objects to retrieve
 * @param response - response object, given to you from the initPayload() function
 * @param setLinksCB - callback used to set the context-data of the response object. (the links-part, of the payload-object)
 */
function getLinkData (db, offset, amount, response, pageQuery, setLinksCB) {
  // FIXME: getTotal(req, response) doesn't work because of the async nature of calls to sqlite3
  // const pageCountQuery = (signed) ? `select count(*) as count from components where approved=1` : `select count(*) as count from components where approved=0`
  db.get(pageQuery, (err, row) => {
    if (err) {
      response = initPayload() // effectively empty payload, reset cursor to beginning, default parameters
      response.errors.message.push('Could not get element count from database.')
      response.errorflag = true
      response.meta.count = 0
    } else {
      // response.meta.count = Number.isSafeInteger(row.count) ? row.count : 0
      // Object.assign(response.meta, meta)
      response.meta.count = row.count
      // if these parameters are malformed, the response defaults to the first 30 items (0, 30)
      if (!isNaN(response.meta.count) && Number.isSafeInteger(response.meta.count)) {
        if (isNaN(offset) || isNaN(amount)) {
          let links = {
            prev: 0,
            current: 0,
            next: (0 + amount) < response.meta.count ? amount : 0
          }
          response.errorflag = true
          response.errors.message.push('Illegal query parameters passed')
          setLinksCB(links)
        } else if (Number.isSafeInteger(offset) && Number.isSafeInteger(amount)) {
          let links = {
            prev: (offset - amount) > 0 ? (offset - amount) : 0,
            current: offset,
            next: (offset + amount) <= response.meta.count ? (offset + amount) : (response.meta.count)
          }
          setLinksCB(links)
        }
      } else {
        response.errorflag = true
        response.errors.message.push('Illegal query parameters')
      }
    }
  })
}

// Example request: components/search/o/?offset=0&amount=3&sort=componentName&order=desc
function handleGetRequest (req, res, isSigned) {
  // if these parameters are malformed, the response defaults to the first 30 items (0, 30)
  let response = initPayload()
  const offset = parseInt(+req.query.offset) || 0
  const amount = parseInt(+req.query.amount) || 5
  const approved = (isSigned) ? 1 : 0
  let sorting = (req.query.sort === 'undefined') ? `productName` : `${req.query.sort}`
  let ordering = (req.query.order === 'undefined') ? `asc` : `${req.query.order}`
  let sort = {column: `&sort=${sorting}`, order: `&order=${ordering}`}
  response.sort = sort
  getLinkData(req.db, offset, amount, response, `select count(*) as count from products where approved='${approved}'`, (links) => {
    response.links = {
      prev: `?offset=${links.prev}&amount=${amount}`,
      current: `?offset=${links.current}&amount=${amount}`,
      next: `?offset=${links.next}&amount=${amount}`
    }

    if (!response.errorflag) {
    // since req.query.offset and amount has been passed through parseInt, isNan and isSafeNumber, errorFlag is not set
      const query = `SELECT * FROM products where approved=${approved} order by ${sorting} ${ordering} LIMIT ${offset}, ${amount} `
      req.db.all(query, (err, rows) => {
        if (err) {
          response.errors.message = [err]
          response.errors.status = 'ERROR'
          response.errors.errorflag = true
          res.json(response)
        } else {
          response.items = rows
          response.errors.status = 'OK' // FIXME: Perhaps not a necessary attribute ?
          res.json(response)
        }
      // = rows
      })
    }
  })
}

router.route('/all')
  .get((req, res) => {
    // if these parameters are malformed, the response defaults to the first 30 items (0, 30)
    let response = initPayload()
    const offset = parseInt(+req.query.offset) || 0
    const amount = parseInt(+req.query.amount) || 5
    let sorting = (req.query.sort === 'undefined') ? `productName` : `${req.query.sort}`
    let ordering = (req.query.order === 'undefined') ? `asc` : `${req.query.order}`
    getLinkData(req.db, offset, amount, response, `select count(*) as count from products`, (links) => {
      response.links = {
        prev: `?offset=${links.prev}&amount=${amount}`,
        current: `?offset=${links.current}&amount=${amount}`,
        next: `?offset=${links.next}&amount=${amount}`
      }
    })
    for (let uri in response.links) {
      const link = `${response.links[uri]}&sort=${sorting}&order=${ordering}`
      response.links[uri] = link
    }
    for (let a in response.links) {
    }
    if (!response.errorflag) {
      // since req.query.offset and amount has been passed through parseInt, isNan and isSafeNumber, errorFlag is not set
      const query = `SELECT * FROM products order by ${sorting} ${ordering} LIMIT ${offset}, ${amount} `
      req.db.all(query, (err, rows) => {
        if (err) {
          response.errors.message = [err]
          response.errors.status = 'ERROR'
          response.errors.errorflag = true
          res.json(response)
        } else {
          response.items = rows
          response.errors.status = 'OK' // FIXME: Perhaps not a necessary attribute ?
          res.json(response)
        }
        // = rows
      })
    }
  })

router.route('/')
  .get((req, res) => {
    handleGetRequest(req, res, SIGNED)
  })

router.route('/pending')
  .get((req, res) => {
    handleGetRequest(req, res, NOTSIGNED)
  })

// ----------------------------------------------------------------------------
//  Methods for /products/approve
// ----------------------------------------------------------------------------
router.route('/approve')
  .put((req, res) => {
    // precondition: check that id === OK, signature === OK and that the product hasn't yet been signed
    const input = req.body
    let approved = getCorrectApproved(input)

    // Get product to make sure that it is not approved already
    getProduct(req, res, null, null, input.id, function (product) {
      // Make sure that row is not null and that an approved product can't be approved again by a diffrent person
      if (product !== null && input.id !== null && validateRequest(product, approved)) {
        // update the product
        updateProduct(req, res, null, null, input.id, ['approved', 'approvedBy'], approved, function () {
          insertUpdateIntoLog(req, res, product.id, approved)
        })
      } else {
        // Else throw an error
        let message
        message = {
          'errorType': 'alreadySigned',
          'byUser': '' + product.approvedBy
          // "onTime": "1510062744"
        }
        res.status(500).send(message)
      }
    })
    // postcondition: product approved, signed and logged
  })

/**
 * Get validated.
 * @param {JSON} product
 * @param {Array} approved
 * @return {Boolean}
 */
function validateRequest (product, approved) {
  return ((approved[0] === null && approved[1] === null) || ((product.approved === 1 && approved[0] === 0) || (product.approved !== 1 && approved[1] !== '')))
}

/**
 * Get approved.
 * @param {JSON} input
 * @return {Array} approved
 */
function getCorrectApproved (input) {
  let approved = [null, null]

  if (input.hasOwnProperty('approved')) {
    if (input.approved === 0 && approved[1] === null) {
      approved[1] = ''
    }
    approved[0] = input.approved
  }

  if (input.hasOwnProperty('approvedBy')) {
    if (input.approvedBy !== '') {
      approved[0] = 1
      approved[1] = input.approvedBy
    }
  }

  // logic for correct approve/approvedBy
  if (approved[0] !== null) {
    if (approved === 0 && approved[1] === null) {
      approved[1] = ''
    } else if (approved === 1 && approved[1] === null) {
      approved[0] = null
    }
  }
  return approved
}

// ----------------------------------------------------------------------------
//  Methods for /products/pending
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
//  Methods for /products/productsWithComponent/:id
// ----------------------------------------------------------------------------
router.route('/productsWithComponent/:id')
  .get((req, res) => {
    // precondition: component exists and is connected with atleast one product.
    let input = req.params.id
    if (input !== null) {
      // Get products connected to the component
      getProductsWithComponent(req, res, input)
    }
    // postcondition: products with the components connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/add
// ----------------------------------------------------------------------------
router.route('/add')
  .post((req, res) => {
    // precondition: product doesn't already exist.
    const input = req.body
    const components = input.components
    req.db.run('begin', (err) => {
      if (err) {
      } else {
        addProduct(input, (query) => {
          req.db.run(query, (err) => {
            if (err) {
              // res.status(500)
              req.db.run('rollback')
              // res.send('ERROR! error message:' + err.message + ', query: ' + query)
              res.error_id = 'E03'
              res.send('error')
            } else {
              getProduct(req, res, input.productName, input.productVersion, null, function (product) {
                insertProductLog(req, res, product.id, 'Product created.',
                  function (returnValue) {
                  // här säger vi; för alla komponenter, låt comp vara komponent
                  // lägg in komponent i produkt
                    components.forEach((comp) => {
                      insertComponentIntoProduct(req, res, comp, product.id, (succeeded) => {
                        if (!succeeded) { // if *any* of the insertions fail, we rollback the entire thing
                          req.db.run('rollback')
                          res.status(500)
                          res.send('Error! Component was not found!')
                        }
                      })
                    })
                    req.db.run('commit')
                    res.status(201).send('success')
                  })
              })
            }
          })
        })
      }
    })
    // postcondition: product created and logged.
  })

/**
 * Get product
 * @param {JSON} product
 * @param {String} cb
 */
function addProduct (product, cb) {
  let date = new Date().toLocaleDateString()
  const query = `INSERT INTO products (productName, productVersion, dateCreated, lastEdited, comment, approved) VALUES ('${product.productName}','${product.productVersion}','${date}','${date}','${product.comment}', '0')`
  cb(query)
}

// ----------------------------------------------------------------------------
//  Methods for /products/connectComponentWithProduct
// ----------------------------------------------------------------------------
router.route('/connectComponentWithProduct')
  .post((req, res) => {
    // precondition: Component must exist aswell as the product.
    const input = req.body

    if (input.productID !== null && input.componentID !== null) {
      // Insert the provided license into the component
      insertComponentIntoProduct(req, res, input.componentID, input.productID, function (returnValue) {
        // Get the component that was inserted
        getComponent(req, res, null, null, input.componentID, function (component) {
          if (component === null) {
            let message = {
              'errorType': 'componentDoesNotExist'
            }
            res.status(500).send(message)
          } else {
            // Create a log of the license added to the component
            insertProductLog(req, res, input.productID, 'Added component: ' + component.componentName + ' v' + component.componentVersion + '.',
              function (returnValue) {
                updateProduct(req, res, null, null, input.productID, ['approved', 'approvedBy'], ['0', ''], function (returnValue) {
                  res.status(200).send('Success')
                })
              })
          }
        })
      })
    }
    // postcondition: The component is connected with the product.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/productsInProject/:id
// ----------------------------------------------------------------------------
router.route('/productsInProject/:id')
  .get((req, res) => {
    // precondition: project exists and it has products connected to it.
    let input = req.params.id
    if (input !== null) {
      // Get products from the project
      getproductsFromProject(req, res, input)
    }
    // postcondition: components connected to the product.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/productsWithLicense/:id
// ----------------------------------------------------------------------------
router.route('/productsWithLicense/:id')
  .get((req, res) => {
    // precondition: license exists and it has atleast one component connected to it.
    let input = req.params.id
    if (input !== null) {
      // Get products connected to the license
      getProductsWithLicense(req, res, input)
    }
    // postcondition: products with the license connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/log/:id
// ----------------------------------------------------------------------------
router.route('/log/:id')
.get((req, res) => {
  // precondition: component exists.
  let input = req.params.id
  if (input !== null) {
    // Get the component log
    // getComponentLog(req, res, input)
  }
  // postcondition: the log entries of the component
})

// ----------------------------------------------------------------------------
// Methods for /comment
// ----------------------------------------------------------------------------
router.route('/comment')
  .post((req, res) => {
    // precondition: Product exists.
    let input = req.body
    if (input.id !== null && input.comment !== null) {
      getProduct(req, res, null, null, input.id, function (product) {
        if (product !== null) {
          setProductLog(req, res, input, product.comment, function (returnValue) {
            if (returnValue) {
              // Get products from the product
              setProductComment(req, res, input)
            }
          })
        } else {
          res.status(406).send('ERROR!')
          res.error_id = 'E09'
        }
      })
    } else {
      res.status(406).send('ERROR! ID or Comment was not provided.')
    }
    // postcondition: The comment of the product is changed.
  })

/**
 * Changes the comment of a product.
 * @param {Object} req
 * @param {Object} res
 * @param {JSON} input
 */
function setProductComment (req, res, input) {
  let query = 'UPDATE products SET comment = ? WHERE id = ?;'

  req.db.all(query, [input.comment, input.id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.status(200).send('success') }
  })
}

// ----------------------------------------------------------------------------
//  Methods for /products/:id
// ----------------------------------------------------------------------------
router.route('/product/:id')

  .get((req, res) => {
    let input = req.params.id
    const query = `SELECT * FROM products WHERE id=${input}`
    req.db.get(query, (err, row) => {
      if (err) {
        res.status(404)
        res.send('ERROR! error message:' + err.message + ', query: ' + query)
      } else {
        res.status(200)
        res.json(row)
      }
    })
  })

// ----------------------------------------------------------------------------
//  Methods for /products/search/:id
// ----------------------------------------------------------------------------

router.route('/search/:id')
  .get((req, res) => {
    // precondition: parameter is wellformed
    const query = `select * from products where productName LIKE "%${req.params.id}%"`
    req.db.all(query, (err, rows) => {
      if (err) {
        res.status(404)
        res.send('ERROR! error message:' + err.message + ', query: ' + query)
      } else {
        res.status(200)
        res.json(rows)
      }
    })
  })

module.exports = router
/*
// Get component from parameters
function getProductFromParameters (req, res, input, parametersText, parameters) {
  let query = 'SELECT * FROM products WHERE '

  let first = false
  for (let i = 0; i < parametersText.length; i++) {
    if (!first) {
      first = true
      query += parametersText[i] + ' = ?'
    } else {
      query += ' AND ' + parametersText[i] + ' = ?'
    }
    parameters.push(input[parametersText[i]])
  }

  req.db.all(query, parameters, (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query + ', parameters: ' + parameters)
    } else { res.json(rows) }
  })
}
*/

/**
 * Get product
 * @param {Object} req
 * @param {Object} res
 * @param {String} productName
 * @param {String} productVersion
 * @param {Integer} id
 * @param {JSON} callback
 */
function getProduct (req, res, productName, productVersion, id, callback) {
  let query = 'SELECT * FROM products'
  let parameters = []
  if (productName !== null && productVersion !== null) {
    query += ' WHERE productName = ? AND productVersion = ?;'
    parameters.push(productName)
    parameters.push(productVersion)
  } else if (id !== null) {
    query += ' WHERE id = ?;'
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      res.status(500)
      res.send('ERROR! error message:' + error.message + ', query: ' + query + ', parameters: ' + parameters)
    } else {
      if (row !== null) {
        callback(row)
      } else callback(null)
    }
  })
}

/**
 * Get component
 * @param {Object} req
 * @param {Object} res
 * @param {String} componentName
 * @param {String} componentVersion
 * @param {Integer} id
 * @param {JSON} callback
 */
function getComponent (req, res, componentName, componentVersion, id, callback) {
  let query = 'SELECT * FROM components'
  let parameters = []
  if (componentName !== null && componentVersion !== null) {
    query += ' WHERE componentName = ? AND componentVersion = ?;'
    parameters.push(componentName)
    parameters.push(componentVersion)
  } else if (id !== null) {
    query += ' WHERE id = ?;'
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      res.status(500)
      res.send('ERROR! error message:' + error.message + ', query: ' + query + ', parameters: ' + parameters)
    } else {
      if (row !== null) {
        callback(row)
      } else callback(null)
    }
  })
}

/**
 * Insert a new row into productLog
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 * @param {String} text
 * @param {Boolean} callback
 */
function insertProductLog (req, res, id, text, callback) {
  let parametersLog = [id, new Date().toLocaleDateString(), text]
  let queryLog = 'INSERT INTO productLog (productID, dateLogged, note) VALUES (?, ?, ?);'
  req.db.run((queryLog), parametersLog, (error) => {
    if (error) {
      res.status(500)
      res.send(error.message)
    } else {
      let t = true
      callback(t)
    }
  })
}

/**
 * Update the product
 * @param {Object} req
 * @param {Object} res
 * @param {String} productName
 * @param {String} productVersion
 * @param {Integer} id
 * @param {Array} parametersText
 * @param {Array} parameters
 * @param {Boolean} callback
 */
function updateProduct (req, res, productName, productVersion, id, parametersText, parameters, callback) {
  let query = 'UPDATE products SET '

  // Construct the remaining SQL query
  let first = false
  for (let i = 0; i < parametersText.length; i++) {
    if (!first) {
      first = true
      query += parametersText[i] + ' = ?'
    } else {
      query += ', ' + parametersText[i] + ' = ?'
    }
  }

  // Check if either productName/productVersion or id was provided and use them one find the row to alter
  if (productName !== null && productVersion !== null) {
    query += ' WHERE productName = ? AND productVersion = ?;'
    parameters.push(productName)
    parameters.push(productVersion)
  } else if (id !== null) {
    query += ' WHERE id = ?;'
    parameters.push(id)
  }

  req.db.run(query, parameters, (error) => {
    if (error) {
      res.status(500)
      res.send('ERROR! error message:' + error.message + ', query: ' + query + ', parameters: ' + parameters)
    } else {
      let t = true
      callback(t)
    }
  })
}

/**
 * Insert a component into a product
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} componentID
 * @param {Integer} productID
 * @param {Boolean} callback
 */
function insertComponentIntoProduct (req, res, componentID, productID, callback) {
  // Insert the component as a component of the component
  let query = 'INSERT INTO componentsInProducts ( componentID, productID) VALUES (?, ?);'
  let parameters = [componentID, productID]
  req.db.run(query, parameters, (error) => {
    if (error) {
      res.status(500)
      res.send(error.message)
      res.error_id = 'E07'
    } else {
      let t = true
      callback(t)
    }
  })
}

/**
 * Insert the update into the ProductLog
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} correctInputId
 * @param {Array} approved
 */
function insertUpdateIntoLog (req, res, correctInputId, approved) {
  // If approve has changed then log it
  if (req.body.hasOwnProperty('approved')) {
    if (approved[0] === 0) {
      insertProductLog(req, res, correctInputId, 'Product changed to not approved.', function (log) {
      })
    } else if (approved[0] === 1) {
      insertProductLog(req, res, correctInputId, 'Product changed to approved by ' + approved[1] + '.', function (log) {
      })
    }
  } else if (req.body.hasOwnProperty('approvedBy')) {
    // If approveBy has changed then log it
    if (approved[1] === '') {
      insertProductLog(req, res, correctInputId, 'Product changed to not approved.', function (log) {
      })
    } else if (approved[1] !== '') {
      insertProductLog(req, res, correctInputId, 'Product changed to approved by ' + approved[1] + '.', function (log) {
      })
    }
  }
  res.status(204)
  res.send('Success!')
}

/**
 * Get products in project
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getproductsFromProject (req, res, id) {
  let query = 'SELECT productID AS id, productName, productVersion, dateCreated, lastEdited, comment, approved, approvedBy FROM products LEFT OUTER JOIN productsInProjects ON products.id=productsInProjects.productID'

  query += ' WHERE projectID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.send(rows) }
  })
}

/**
 * Get products connected to license
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getProductsWithLicense (req, res, id) {
  let query = 'SELECT DISTINCT productID AS id, productName, productVersion, dateCreated, lastEdited, comment, approvedBy FROM products LEFT OUTER JOIN componentsInProducts ON products.id=componentsInProducts.productID' +
              ' LEFT OUTER JOIN licensesInComponents ON licensesInComponents.componentID=componentsInProducts.componentID'

  query += ' WHERE licenseID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.send(rows) }
  })
}

/**
 * Get products connected to component
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getProductsWithComponent (req, res, id) {
  let query = 'SELECT DISTINCT productID AS id, productName, productVersion, dateCreated, lastEdited, comment, approvedBy FROM products LEFT OUTER JOIN componentsInProducts ON products.id=componentsInProducts.productID'

  query += ' WHERE componentID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else {
      res.send(rows)
    }
  })
}

/**
 * Gets the product.
 * @param {Object} req
 * @param {Object} res
 * @param {JSON} input
 * @param {String} old
 * @param {boolean} callback
 */
function setProductLog (req, res, input, old, callback) {
  let query = 'INSERT INTO productLog (productID, dateLogged, note) VALUES (?, ?, ?);'
  let note = ''
  if (input.comment !== null) {
    note = 'Comment changed from: ' + old + ' to: ' + input.comment + '.'
  }
  req.db.run(query, [input.id, new Date().toLocaleDateString(), note], (error) => {
    if (error) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + error.message + ', query: ' + query)
    } else {
      let t = true
      callback(t)
    }
  })
}
