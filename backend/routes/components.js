let payloadcfg = require('./config')

let initPayload = payloadcfg.payloadInit.bind(null, 'component')
let NOTSIGNED = payloadcfg.NOTSIGNED
let SIGNED = payloadcfg.SIGNED

var express = require('express')
var router = express.Router()

function handleSearchGetRequest (req, res, isPending) {
  console.log("Handle search get request!")
  // precondition: parameter is wellformed
  let response = initPayload()
  const offset = parseInt(+req.query.offset) || 0
  const amount = parseInt(+req.query.amount) || 5
  const approved = isPending ? 1 : 0
  let sorting = (req.query.sort === 'undefined') ? `componentName` : `${req.query.sort}`
  let ordering = (req.query.order === 'undefined') ? `asc` : `${req.query.order}`
  let sort = {column: `&sort=${sorting}`, order: `&order=${ordering}`}
  response.sort = sort
  getLinkData(req.db, offset, amount, response, `select count(*) as count from components where componentName LIKE '%${req.params.id}%' AND approved=${approved}`, (links) => {
    response.links = {
      prev: `?offset=${links.prev}&amount=${amount}`,
      current: `?offset=${links.current}&amount=${amount}`,
      next: `?offset=${links.next}&amount=${amount}`
    }
  })
  if (!response.errorflag) {
    // since req.query.offset and amount has been passed through parseInt, isNan and isSafeNumber, errorFlag is not set
    const query = `SELECT * FROM components where componentName LIKE '%${req.params.id}%' AND approved=${approved} order by ${sorting} ${ordering} LIMIT ${offset}, ${amount}`
    console.log(query)
    req.db.all(query, (err, rows) => {
      if (err) {
        let errormessage = 'ERROR! error message:' + err.message + ', query: ' + query
        response.errors.message = [errormessage]
        response.errors.status = 'ERROR'
        response.errors.errorflag = true
        console.log(err)
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

// ===========================
// Methods for searching
// ===========================
router.route('/search/:id')
  .get((req, res) => {
    console.log('Calling search for components')
    handleSearchGetRequest(req, res, SIGNED)
  })

router.route('/pending/search/:id').get((req, res) => {
  console.log("Calling pending search for components")
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
  // console.log(pageCountQuery)
  db.get(pageQuery, (err, row) => {
    if (err) {
      // console.log("ERROR: " + err.message)
      console.qlog("Error:")
      console.log(err)
      response = initPayload() // effectively empty payload, reset cursor to beginning, default parameters
      response.errors.message.push('Could not get element count from database.')
      response.errorflag = true
      response.meta.count = 0
    } else {
      // response.meta.count = Number.isSafeInteger(row.count) ? row.count : 0
      // Object.assign(response.meta, meta)
      response.meta.count = row.count
      console.log("Count: " + response.meta.count)
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
        console.log("ERROR")
        response.errorflag = true
        response.errors.message.push('Illegal query parameters')
      }
    }
  })
}

// Example request: components/search/o/?offset=0&amount=3&sort=componentName&order=desc
function handleGetRequest (req, res, isSigned) {
  console.log("Handle get request!")
  // if these parameters are malformed, the response defaults to the first 30 items (0, 30)
  let response = initPayload()
  const offset = parseInt(+req.query.offset) || 0
  const amount = parseInt(+req.query.amount) || 5
  const approved = (isSigned) ? 1 : 0
  let sorting = (req.query.sort === 'undefined') ? `componentName` : `${req.query.sort}`
  let ordering = (req.query.order === 'undefined') ? `asc` : `${req.query.order}`

  getLinkData(req.db, offset, amount, response, `select count(*) as count from components where approved=${approved}`, (links) => {
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
  if (!response.errorflag) {
    // since req.query.offset and amount has been passed through parseInt, isNan and isSafeNumber, errorFlag is not set
    console.log("Pending: " + approved)
    const query = `SELECT * FROM components where approved=${approved} order by ${sorting} ${ordering} LIMIT ${offset}, ${amount} `
    req.db.all(query, (err, rows) => {
      if (err) {
        console.log(err)
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
    console.log("\x1b[mCalling signed function")
    handleGetRequest(req, res, SIGNED)
  })

router.route('/pending')
  .get((req, res) => {
    console.log("\x1b[93;41m Calling pending function")
    handleGetRequest(req, res, NOTSIGNED)
  })

// ----------------------------------------------------------------------------
// Methods for /comment
// ----------------------------------------------------------------------------
router.route('/comment')
  .post((req, res) => {
    // precondition: Component exists.
    let input = req.body
    if (input.id !== null && input.comment !== null) {
      getComponent(req, res, null, null, input.id, function (component) {
        if (component !== null) {
          setComponentLog(req, res, input, component.comment, function (returnValue) {
            if (returnValue) {
              // Get components from the component
              setComponentComment(req, res, input)
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
    // postcondition: The comment of the component is changed.
  })

/**
 * Changes the comment of a component.
 * @param {Object} req
 * @param {Object} res
 * @param {JSON} input
 */
function setComponentComment (req, res, input) {
  let query = 'UPDATE components SET comment = ? WHERE id = ?;'

  req.db.all(query, [input.comment, input.id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.status(200).send('success') }
  })
}

// ----------------------------------------------------------------------------
//  Methods for /components/approve
// ----------------------------------------------------------------------------

function validateRequest (component, approved) {
  console.log('Validating data')
  return ((approved[0] == null && approved[1] == null) || ((component.approved == 1 && approved[0] == 0) || (component.approved != 1 && approved[1] != '')))
}

function getCorrectApproved (input) {
  let approved = [null, null]

  if (input.hasOwnProperty('approved')) {
    if (input.approved == 0 && approved[1] == null) {
      approved[1] = ''
    }
    approved[0] = input.approved
  }

  if (input.hasOwnProperty('approvedBy')) {
    if (input.approvedBy != '') {
      approved[0] = 1
      approved[1] = input.approvedBy
    }
  }

  // logic for correct approve/approvedBy
  if (approved[0] != null) {
    if (approved == 0 && approved[1] == null) {
      approved[1] = ''
    } else if (approved == 1 && approved[1] == null) {
      approved[0] = null
    }
  }
  return approved
}

// ----------------------------------------------------------------------------
//  Methods for /components/approve
// ----------------------------------------------------------------------------
router.route('/approve')
  .put((req, res) => {
    // precondition: check that id == OK, signature == OK and that component hasn't yet been signed
    const input = req.body
    let approved = getCorrectApproved(input)

    // Get component to make sure that it is not approved already
    getComponent(req, res, null, null, input.id, function (component) {
      // Make sure that row is not null and that an approved component can't be approved again by a diffrent person
      if (component != null && input.id != null && validateRequest(component, approved)) {
        // update the component
        updateComponent(req, res, null, null, input.id, ['approved', 'approvedBy'], approved, function () {
          insertUpdateIntoLog(req, res, component.id, approved)
        })
      }// Else throw an error
      else {
        let message
        message = {
          'errorType': 'alreadySigned',
          'byUser': '' + component.approvedBy
          // "onTime": "1510062744"
        }
        console.log(message)
        res.status(500).send(message)
      }
    })
    // postcondition: component approved, signed and logged
  })

// ----------------------------------------------------------------------------
//  Methods for /components/add
// ----------------------------------------------------------------------------
router.route('/add')
  .post((req, res) => {
    // precondition: component doesn't already exist.
    let licenses = req.body.licenses
    req.db.run('begin', () => {
      addComponent(req.body, (query) => {
        req.db.run(query, (error) => {
          if (error) {
            console.log(error.message)
            res.status(500)
            req.db.run('rollback')
            res.send('ERROR! error message:' + error.message + ', query: ' + query)
          } else {
            // Get the component so that the id can be extracted
            getComponent(req, res, req.body.componentName, req.body.componentVersion, null, function (component) {
              insertComponentLog(req, res, component.id, 'Component created.',
                function (returnValue) {
                  licenses.forEach((license) => insertLicenseIntoComponent(req, res, license, component.id, (succeeded) => {
                    if (!succeeded) {
                      req.db.run('rollback')
                      res.status(500)
                      res.send('Error! Component was not found!')
                    }
                  }))
                  req.db.run('commit')
                  res.status(201).send('Success!')
                })
            })
          }
        })
      })
    })
    // postcondition: component created and logged.
  })

function addComponent (component, cb) {
  let date = new Date().toLocaleDateString()
  const query = `INSERT INTO components (componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy) VALUES ('${component.componentName}','${component.componentVersion}','${date}','${date}','${component.componentName}', 0, '')`
  cb(query)
}

// ----------------------------------------------------------------------------
//  Methods for /components/connectLicenseWithComponent
// ----------------------------------------------------------------------------
router.route('/connectLicenseWithComponent')
  .post((req, res) => {
    // precondition: License must exist aswell as the component.
    const input = req.body

    if (input.licenseID != null && input.componentID != null) {
      // Insert the provided license into the component
      insertLicenseIntoComponent(req, res, input.licenseID, input.componentID, function (returnValue) {
        // Get the license that was inserted
        getLicense(req, res, null, null, input.licenseID, function (license) {
          if (license == null) {
            message = {
              'errorType': 'licenseDoesNotExist'
            }
            console.log(message)
            res.status(500).send(message)
          } else {
            // Create a log of the license added to the component
            insertComponentLog(req, res, input.componentID, 'Added license: ' + license.licenseName + ' v' + license.licenseVersion + '.',
              function (returnValue) {
                updateComponent(req, res, null, null, input.componentID, ['approved', 'approvedBy'], ['0', ''], function (returnValue) {
                  res.status(200).send('Success')
                })
              })
          }
        })
      })
    }
    // postcondition: The license is connected with the component.
  })

// ----------------------------------------------------------------------------
//  Methods for /components/componentsInProduct/:id
// ----------------------------------------------------------------------------
router.route('/componentsInProduct/:id')
  .get((req, res) => {
    // precondition: product exists and it has components connected to it..
    let input = req.params.id
    if (input != null) {
      // Get components from the product
      getComponentsFromProduct(req, res, input)
    }
    // postcondition: components connected to the product.
  })

// ----------------------------------------------------------------------------
//  Methods for /components/componentsInProject/:id
// ----------------------------------------------------------------------------
router.route('/componentsInProject/:id')
  .get((req, res) => {
    // precondition: project exists and it has atleast one product connected to it. The product/s in turn must have components connected to it.
    let input = req.params.id

    if (input != null) {
      // Get components from the product
      getComponentsFromProject(req, res, input)
    }
    // postcondition: components connected to the project.
  })

// ----------------------------------------------------------------------------
//  Methods for /components/componentsWithLicense/:id
// ----------------------------------------------------------------------------
router.route('/componentsWithLicense/:id')
.get((req, res) => {
  // precondition: License exists and is connected with atleast one component.
  let input = req.params.id

  if (input != null) {
    // Get components from the product
    getComponentsWithLicense(req, res, input)
  }
  // postcondition: components with license connected to it.
})

// ----------------------------------------------------------------------------
//  Methods for /components/log/:id
// ----------------------------------------------------------------------------
router.route('/log/:id')
.get((req, res) => {
  // precondition: component exists.
  let input = req.params.id
  if (input != null) {
    // Get the component log
    getComponentLog(req, res, input)
  }
  // postcondition: the log entries of the component
})

// ---------------------u-------------------------------------------------------
//  Methods for /components/search/:id
// ---------------------------------------------------------------------------_

function getComponent (req, res, componentName, componentVersion, id, callback) {
  let query = 'SELECT * FROM components'
  let parameters = []
  if (componentName != null && componentVersion != null) {
    query += ' WHERE componentName = ? AND componentVersion = ?;'
    parameters.push(componentName)
    parameters.push(componentVersion)
  } else if (id != null) {
    query += ' WHERE id = ?;'
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send('ERROR! error message:' + error.message + ', query: ' + query + ', parameters: ' + parameters)
    } else {
      if (row != null) {
        callback(row)
      } else callback(null)
    }
  })
}

// Get component in product
function getComponentsFromProduct (req, res, id) {
  let query = 'SELECT componentID AS id , componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy ' +
    'FROM ' +
    'components ' +
    'INNER JOIN ' +
    'componentsInProducts ' +
    'ON ' +
    'components.id=componentsInProducts.componentID ' +
    'WHERE '

  query += 'productID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else {
      console.log(rows)
      res.json(rows)
    }
  })
}

// Get component in project
function getComponentsFromProject (req, res, id) {
  let query = 'SELECT DISTINCT componentID AS id, componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy FROM components LEFT OUTER JOIN componentsInProducts ON components.id=componentsInProducts.componentID' +
  ' LEFT OUTER JOIN productsInProjects ON productsInProjects.productID=componentsInProducts.productID WHERE '

  query += 'projectID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.send(rows) }
  })
}

// Get components with license
function getComponentsWithLicense (req, res, id) {
  let query = 'SELECT componentID AS id , componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy ' +
    'FROM ' +
    'components ' +
    'INNER JOIN ' +
    'licensesInComponents ' +
    'ON ' +
    'components.id=licensesInComponents.componentID ' +
    'WHERE '

  query += 'licenseID = ?;'

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else {
      res.json(rows)
    }
  })
}

// Update the component
function updateComponent (req, res, componentName, componentVersion, id, parametersText, parameters, callback) {
  let query = 'UPDATE components SET '

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

  // Check if either componentName/componentVersion or id was provided and use them one find the row to alter
  if (componentName != null && componentVersion != null) {
    query += ' WHERE componentName = ? AND componentVersion = ?;'
    parameters.push(componentName)
    parameters.push(componentVersion)
  } else if (id != null) {
    query += ' WHERE id = ?;'
    parameters.push(id)
  }

  req.db.run(query, parameters, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send('ERROR! error message:' + error.message + ', query: ' + query + ', parameters: ' + parameters)
    } else {
      callback(true)
    }
  })
}


// insert a license into a component
function insertLicenseIntoComponent (req, res, licenseID, componentID, callback) {
  // Insert the license as a license of the component
  let query = 'INSERT INTO licensesInComponents ( licenseID, componentID) VALUES (?, ?);'
  let parameters = [licenseID, componentID]
  req.db.run(query, parameters, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
    } else {
      callback(true)
    }
  })
}

// Get a license
function getLicense (req, res, licenseName, licenseVersion, id, callback) {
  let query = 'SELECT * FROM licenses'
  let parameters = []
  if (licenseName != null && licenseVersion != null) {
    query += ' WHERE licenseName = ? AND licenseVersion = ?;'
    parameters.push(licenseName)
    parameters.push(licenseVersion)
  } else if (id != null) {
    query += ' WHERE id = ?;'
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send('ERROR! error message:' + error.message + ', query: ' + query + ', parameters: ' + parameters)
    } else {
      if (row != null) {
        callback(row)
      } else callback(null)
    }
  })
}

// Insert a new row into componentLog
function insertComponentLog (req, res, id, text, callback) {
  let parametersLog = [id, new Date().toLocaleDateString(), text]
  let queryLog = 'INSERT INTO componentLog (componentID, dateLogged, note) VALUES (?, ?, ?);'
  req.db.run((queryLog), parametersLog, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
    } else {
      callback(true)
    }
  })
}

// Insert the update into the ComponentLog
function insertUpdateIntoLog (req, res, correctInputId, approved, comment) {
  // If the comment was changed then log it
  if (comment != null) {
    insertComponentLog(req, res, correctInputId, 'Comment was changed to: ' + comment + '.', function (log) {
    })
  }
  // If approve has changed then log it
  if (req.body.hasOwnProperty('approved')) {
    if (approved[0] == 0) {
      insertComponentLog(req, res, correctInputId, 'Component changed to not approved.', function (log) {
      })
    } else if (approved[0] == 1) {
      insertComponentLog(req, res, correctInputId, 'Component changed to approved by ' + approved[1] + '.', function (log) {
      })
    }
  }// If approveBy has changed then log it
  else if (req.body.hasOwnProperty('approvedBy')) {
    if (approved[1] == '') {
      insertProductLog(req, res, correctInputId, 'Component changed to not approved.', function (log) {
      })
    } else if (approved[1] != '') {
      insertComponentLog(req, res, correctInputId, 'Component changed to approved by ' + approved[1] + '.', function (log) {
      })
    }
  }
  res.status(204).send('success')
}

// Get component log
function getComponentLog (req, res, id) {
  let query = 'SELECT * FROM componentLog WHERE componentID = ?'

  req.db.all(query, [id], (error, rows) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
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
function setComponentLog (req, res, input, old, callback) {
  let query = 'INSERT INTO componentLog (componentID, dateLogged, note) VALUES (?, ?, ?);'
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

// ----------------------------------------------------------------------------
//  Methods for /components/component/:ids
// ----------------------------------------------------------------------------
router.route('/component/:id')
// In order to search; send in a JSON object with the applicable parameters.
  .get((req, res) => {
    let input = req.params.id
    const query = `SELECT * FROM components WHERE id=${input}`
    req.db.get(query, (err, row) => {
      if (err) {
        console.log(err)
        res.status(404)
        res.send('ERROR! error message:' + err.message + ', query: ' + query)
      } else {
        res.status(200)
        res.json(row)
      }
    })
  })

module.exports = router
