let payloadcfg = require('./config')

let initPayload = payloadcfg.payloadInit.bind(null, 'license')
let NOTSIGNED = payloadcfg.NOTSIGNED
let SIGNED = payloadcfg.SIGNED

var express = require('express')
var router = express.Router()

function handleSearchGetRequest (req, res) {
  // precondition: parameter is wellformed
  let response = initPayload()
  const offset = parseInt(+req.query.offset) || 0
  const amount = parseInt(+req.query.amount) || 5
  let sorting = (req.query.sort === 'undefined') ? `licenseName` : `${req.query.sort}`
  let ordering = (req.query.order === 'undefined') ? `asc` : `${req.query.order}`
  let sort = {column: `&sort=${sorting}`, order: `&order=${ordering}`}
  response.sort = sort

  getLinkData(req.db, offset, amount, response, `select count(*) as count from licenses where licenseName LIKE '%${req.params.id}%'`, (links) => {
    response.links = {
      prev: `?offset=${links.prev}&amount=${amount}`,
      current: `?offset=${links.current}&amount=${amount}`,
      next: `?offset=${links.next}&amount=${amount}`
    }
  })
  if (!response.errorflag) {
    // since req.query.offset and amount has been passed through parseInt, isNan and isSafeNumber, errorFlag is not set
    const query = `SELECT * FROM licenses where licenseName LIKE '%${req.params.id}%' order by ${sorting} ${ordering} LIMIT ${offset}, ${amount}`
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
}

// ----------------------------------------------------------------------------
//  Methods for /search/:id
// ----------------------------------------------------------------------------

router.route('/search/:id')
  .get((req, res) => {
    handleSearchGetRequest(req, res)
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
function handleGetRequest (req, res) {
  // if these parameters are malformed, the response defaults to the first 30 items (0, 30)
  let response = initPayload()
  const offset = parseInt(+req.query.offset) || 0
  const amount = parseInt(+req.query.amount) || 5
  let sorting = (req.query.sort === 'undefined') ? `licenseName` : `${req.query.sort}`
  let ordering = (req.query.order === 'undefined') ? `asc` : `${req.query.order}`

  getLinkData(req.db, offset, amount, response, `select count(*) as count from licenses`, (links) => {
    response.links = {
      prev: `?offset=${links.prev}&amount=${amount}`,
      current: `?offset=${links.current}&amount=${amount}`,
      next: `?offset=${links.next}&amount=${amount}`
    }
  })
  if (!response.errorflag) {
    // since req.query.offset and amount has been passed through parseInt, isNan and isSafeNumber, errorFlag is not set
    const query = `SELECT * FROM licenses order by ${sorting} ${ordering} LIMIT ${offset}, ${amount} `
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
}

router.route('/')
  .get((req, res) => {
    handleGetRequest(req, res)
  })

// ----------------------------------------------------------------------------
//  Methods for /add
// ----------------------------------------------------------------------------
router.route('/add')
  .post((req, res) => {
    // pre-condition:
    // TODO: validate request
    const lic = req.body
    const date = new Date().toLocaleDateString()
    // Construct SQL query based on input parameters.
    const query = `INSERT INTO licenses (licenseName, licenseVersion, dateCreated, lastEdited, URL, comment, licenseType) VALUES ('${lic.licenseName}', '${lic.licenseVersion}', '${date}', '${date}', '${lic.URL}', '${lic.comment}', '${lic.licenseType}')`
    // Send the license to the database.
    req.db.run('begin', () => {
      req.db.run(query, (error) => {
        if (error) {
          res.status(500)
          res.send(error.message)
          res.error_id = 'E04'
        } else {
          let licenseID = 1
          const queryGetID = "SELECT MAX(id) AS 'id' FROM licenses"
          req.db.get(queryGetID, (error, row) => {
            if (error) {
              // If there's an error then provide the error message and the different attributes that could have caused it.
              res.send('ERROR! error message:' + error.message + ' query: ' + queryGetID)
            } else {
              licenseID += row.id
            }
          })
          // Log the creation of the license.
          const logquery = `INSERT INTO licenseLog (licenseID, dateLogged, note) VALUES (${licenseID}, '${date}', 'License created.')`
          req.db.run(logquery, (error) => {
            if (error) {
              res.status(500)
              res.send(error.message)
            } else {
              req.db.run('commit')
              res.status(201)
              res.send('success')
            }
          })
        }
      })
    })
    // postcondition: component created and logged.
  })

// ----------------------------------------------------------------------------
//  Methods for /componentLicenses/:id
// ----------------------------------------------------------------------------
router.route('/licensesInComponent/:id')
  .get((req, res) => {
    let componentID = req.params.id
    let query = `SELECT licenseID as id, licenseName, licenseVersion, dateCreated, lastEdited, comment, URL FROM  licenses INNER JOIN licensesInComponents ON licenses.id=licensesInComponents.licenseID WHERE 
    componentID=${componentID}`
    req.db.all(query, (err, rows) => {
      if (err) {
      }
      res.json(rows)
    })
  })

// ----------------------------------------------------------------------------
//  Methods for /log/:id
// ----------------------------------------------------------------------------
router.route('/log/:id')
  .get((req, res) => {
    // precondition: license exists.
    let input = req.params.id
    if (input !== null) {
      // Get the license log
      getLicenseLog(req, res, input)
    }
    // postcondition: the log entries of the license
  })
// ----------------------------------------------------------------------------
// Methods for /licensesInProduct/:id
// ----------------------------------------------------------------------------
router.route('/licensesInProduct/:id')
  .get((req, res) => {
    // precondition: the product must exists and it must also be connected to atleast one component.
    // This component must inturn be connected to a license.
    let input = req.params.id
    if (input !== null) {
      // Get licenses from the product
      getLicensesFromProduct(req, res, input)
    }
    // postcondition: licenses connected to the product.
  })
// ----------------------------------------------------------------------------
// Methods for /licensesInProject/:id
// ----------------------------------------------------------------------------
router.route('/licensesInProject/:id').get((req, res) => {
  // precondition: the project must exists and it must also be connected to atleast one product.
  // This product must inturn be connected to a component.
  // Which also must be connected to a license.
  let input = req.params.id
  if (input !== null) {
    // Get licenses from the project
    getLicensesFromProject(req, res, input)
  }
  // postcondition: licenses connected to the project.
})

// ----------------------------------------------------------------------------
//  Methods for /licenses/license/:id
// ----------------------------------------------------------------------------
router.route('/license/:id')

  // Search for a license, or license attribute.
  // In order to search; send in a JSON object with the applicable parameters.
  .get((req, res) => {
    let input = req.params.id
    const query = `SELECT * FROM licenses WHERE id=${input}`
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
  // Methods for /comment
  // ----------------------------------------------------------------------------
router.route('/comment')
    .post((req, res) => {
      // precondition: License exists.
      let input = req.body
      if (input.id !== null && input.comment !== null) {
        getLicense(req, res, input.id, function (license) {
          if (license !== null) {
            setLicenseLog(req, res, input, license.comment, function (returnValue) {
              if (returnValue) {
                // Get licenses from the product
                setLicenseComment(req, res, input)
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
      // postcondition: The comment of the license is changed.
    })

  /**
   * Changes the comment of a license.
   * @param {Object} req
   * @param {Object} res
   * @param {JSON} input
   */
function setLicenseComment (req, res, input) {
  let query = 'UPDATE licenses SET comment = ? WHERE id = ?;'

  req.db.all(query, [input.comment, input.id], (err, rows) => {
    if (err) {
        // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.status(200).send('success') }
  })
}

  // ----------------------------------------------------------------------------
  // Methods for /URL
  // ----------------------------------------------------------------------------
router.route('/URL')
    .post((req, res) => {
      // precondition: License exists.
      let input = req.body
      if (input.id !== null && input.URL !== null) {
        getLicense(req, res, input.id, function (license) {
          if (license !== null) {
            setLicenseLog(req, res, input, license.URL, function (returnValue) {
              if (returnValue) {
                // Get licenses from the product
                setLicenseURL(req, res, input)
              }
            })
          } else {
            res.status(406).send('ERROR!')
            res.error_id = 'E09'
          }
        })
      } else {
        res.status(406).send('ERROR! ID or URL was not provided.')
      }

// postcondition: The URL of the license is changed.
    })

/**
 * Changes the URL of a license.
 * @param {Object} req
 * @param {Object} res
 * @param {JSON} input
 */
function setLicenseURL (req, res, input) {
  let query = 'UPDATE licenses SET URL = ? WHERE id = ?;'

  req.db.all(query, [input.URL, input.id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.status(200).send('success') }
  })
}

/**
 * Gets the log of a license.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getLicenseLog (req, res, id) {
  let query = 'SELECT * FROM licenseLog WHERE licenseID = ?'

  req.db.all(query, [id], (error, rows) => {
    if (error) {
      res.status(500)
      res.send(error.message)
    } else {
      res.send(rows)
    }
  })
}

/**
 * Gets the licenses connected with a product.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getLicensesFromProduct (req, res, id) {
  let query = 'SELECT DISTINCT licenseID AS id , licenseName, licenseVersion, dateCreated, lastEdited, comment FROM licenses LEFT OUTER JOIN' +
    ' licensesInComponents ON licenses.id=licensesInComponents.licenseID LEFT OUTER JOIN componentsInProducts ON componentsInProducts.componentID=licensesInComponents.componentID' +
    ' WHERE productID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.json(rows) }
  })
}

/**
 * Gets the licenses connected with a project.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getLicensesFromProject (req, res, id) {
  let query = 'SELECT DISTINCT licenseID AS id , licenseName, licenseVersion, dateCreated, lastEdited, comment FROM licenses LEFT OUTER JOIN licensesInComponents ON licenses.id=licensesInComponents.licenseID' +
              ' LEFT OUTER JOIN componentsInProducts ON componentsInProducts.componentID=licensesInComponents.componentID' +
              ' LEFT OUTER JOIN productsInProjects ON productsInProjects.productID=componentsInProducts.productID' +
    ' WHERE projectID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.json(rows) }
  })
}

/**
 * Gets the license.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 * @param {Object} callback
 */
function getLicense (req, res, id, callback) {
  let query = 'SELECT * from licenses WHERE id = ?;'

  req.db.get(query, id, (error, row) => {
    if (error) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + error.message + ', query: ' + query)
    } else { callback(row) }
  })
}

/**
 * Gets the license.
 * @param {Object} req
 * @param {Object} res
 * @param {JSON} input
 * @param {String} oldComment
 * @param {boolean} callback
 */
function setLicenseLog (req, res, input, old, callback) {
  let query = 'INSERT INTO licenseLog (licenseID, dateLogged, note) VALUES (?, ?, ?);'
  let note = ''
  if (input.comment !== null) {
    note = 'Comment changed from: ' + old + ' to: ' + input.comment + '.'
  } else if (input.URL !== null) {
    note = 'URL changed from: ' + old + ' to: ' + input.URL + '.'
  }
  req.db.run(query, [input.id, new Date().toLocaleDateString(), note], (error) => {
    if (error) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + error.message + ', query: ' + query)
    } else {
      let v = true
      callback(v)
    }
  })
}

module.exports = router
