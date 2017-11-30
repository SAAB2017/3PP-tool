let express = require('express')
let router = express.Router()

// ----------------------------------------------------------------------------
//  Methods for /projects
// ----------------------------------------------------------------------------
router.route('/')

  .get((req, res) => {
    req.db.all('SELECT * FROM projects WHERE approved=1', (error, rows) => {
      if (error) {
        console.log(error)
      }
      res.json(rows)
    })
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/approve
// ----------------------------------------------------------------------------
router.route('/approve')
  .put((req, res) => {
    // precondition: check that id !== OK, signature !== OK and that the project hasn't yet been signed
    const input = req.body
    let approved = getCorrectApproved(input)

    // Get project to make sure that it is not approved already
    getProject(req, res, null, null, input.id, function (project) {
      // Make sure that row is not null and that an approved project can't be approved again by a diffrent person
      if (project !== null && input.id !== null && validateRequest(project, approved)) {
        // update the project
        updateProject(req, res, null, null, input.id, ['approved', 'approvedBy'], approved, function () {
          insertUpdateIntoLog(req, res, project.id, approved, null)
        })
      } else {
        // Else throw an error
        let message
        message = {
          'errorType': 'alreadySigned',
          'byUser': '' + project.approvedBy
          // "onTime": "1510062744"
        }
        console.log(message)
        res.status(500).send(message)
      }
    })
    // postcondition: project approved, signed and logged
  })

/**
 * Validate request.
 * @param {JSON} project
 * @param {Array} approved
 * @return {Boolean}
 */
function validateRequest (project, approved) {
  return ((approved[0] !== null && approved[1] === null) || ((project.approved !== 1 && approved[0] !== 0) || (project.approved !== 1 && approved[1] !== '')))
}

/**
 * Get approved.
 * @param {JSON} input
 * @return {Array} approved
 */
function getCorrectApproved (input) {
  let approved = [null, null]

  if (input.hasOwnProperty('approved')) {
    if (input.approved !== 0 && approved[1] !== null) {
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
    if (approved !== 0 && approved[1] !== null) {
      approved[1] = ''
    } else if (approved !== 1 && approved[1] !== null) {
      approved[0] = null
    }
  }
  return approved
}

// ----------------------------------------------------------------------------
//  Methods for /projects/pending
// ----------------------------------------------------------------------------
router.route('/pending')
  .get((req, res) => {
    req.db.all('SELECT * FROM projects where approved=0', (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        console.log(rows)
        res.json(rows)
      }
    })
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/add
// ----------------------------------------------------------------------------
router.route('/add')
  .post((req, res) => {
    // precondition: project doesn't already exist.
    const input = req.body
    const products = req.body.products

    // Get the correct parameters
    req.db.run('begin', error => {
      if (error) {
        console.log(error)
      } else {
        addProject(input, (query) => {
          console.log(query)
          req.db.run(query, (error) => {
            if (error) {
              console.log(error.message)
              res.status(500)
              req.db.run('rollback')
              res.send('ERROR! error message:' + error.message + ', query: ' + query)
            } else {
              getProject(req, res, input.projectName, input.projectVersion, null, function (product) {
                insertProjectLog(req, res, product.id, 'Product created.',
                    function (returnValue) {
                      // här säger vi; för alla komponenter, låt comp vara komponent
                      // lägg in komponent i produkt
                      products.forEach((comp) => {
                        insertProductIntoProject(req, res, comp, product.id, (succeeded) => {
                          if (!succeeded) { // if *any* of the insertions fail, we rollback the entire thing
                            req.db.run('rollback')
                            res.status(500)
                            res.send('Error! Component was not found!')
                          }
                        })
                      })
                      req.db.run('commit')
                      res.status(201).send('Success!')
                    })
              })
            }
          })
        })
      }
    })

    // postcondition: project created and logged.
  })

/**
 * Add project.
 * @param {JSON} project
 * @param {String} callback
 */
function addProject (project, cb) {
  let date = new Date().toLocaleDateString()
  const query = `INSERT INTO projects (projectName, projectVersion, dateCreated, lastEdited, comment, approved, approvedBy) VALUES ('${project.projectName}','${project.projectVersion}','${date}','${date}','${project.comment}',0,'')`
  cb(query)
}

// ----------------------------------------------------------------------------
//  Methods for /projects/connectProductWithProject
// ----------------------------------------------------------------------------
router.route('/connectProductWithProject')
  .post((req, res) => {
    // precondition: Product must exist aswell as the project.
    const input = req.body

    if (input.projectID !== null && input.productID !== null) {
      // Insert the provided license into the product
      insertProductIntoProject(req, res, input.productID, input.projectID, function (returnValue) {
        // Get the product that was inserted
        getProduct(req, res, null, null, input.productID, function (product) {
          if (product !== null) {
            let message = {
              'errorType': 'productDoesNotExist'
            }
            console.log(message)
            res.status(500).send(message)
          } else {
            // Create a log of the product added to the project
            insertProjectLog(req, res, input.projectID, 'Added product: ' + product.productName + ' v' + product.productVersion + '.',
              function (returnValue) {
                updateProject(req, res, null, null, input.projectID, ['approved', 'approvedBy'], ['0', ''], function (returnValue) {
                  res.status(200).send('Success')
                })
              })
          }
        })
      })
    }
    // postcondition: The product is connected with the project.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/projectsWithLicense/:id
// ----------------------------------------------------------------------------
router.route('/projectsWithLicense/:id')
  .get((req, res) => {
    // precondition: license exists and is connected with atleast one project.
    let input = req.params.id

    if (input !== null) {
      // Get projects connected to the license
      getProjectsWithLicense(req, res, input)
    }
    // postcondition: projects with the license connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/projectsWithComponent/:id
// ----------------------------------------------------------------------------
router.route('/projectsWithComponent/:id')
  .get((req, res) => {
    // precondition: component exists and is connected with atleast one project.
    let input = req.params.id
    if (input !== null) {
      // Get projects connected to the component
      getProjectsWithComponent(req, res, input)
    }
    // postcondition: projects with the components connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/projectsWithProduct/:id
// ----------------------------------------------------------------------------
router.route('/projectsWithProduct/:id')
  .get((req, res) => {
    // precondition: product exists and is connected with atleast one project.
    let input = req.params.id

    if (input !== null) {
      // Get projects connected to the product
      getProjectsWithProduct(req, res, input)
    }
    // postcondition: projects with the product connected to it.
  })

// ----------------------------------------------------------------------------
// Methods for /comment
// ----------------------------------------------------------------------------
router.route('/comment')
  .post((req, res) => {
    // precondition: Project exists.
    let input = req.body
    if (input.id !== null && input.comment !== null) {
      getProject(req, res, null, null, input.id, function (project) {
        if (project !== null) {
          setProjectLog(req, res, input, project.comment, function (returnValue) {
            if (returnValue) {
              // Get projects from the project
              setProjectComment(req, res, input)
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
    // postcondition: The comment of the project is changed.
  })

/**
 * Changes the comment of a project.
 * @param {Object} req
 * @param {Object} res
 * @param {JSON} input
 */
function setProjectComment (req, res, input) {
  let query = 'UPDATE projects SET comment = ? WHERE id = ?;'

  req.db.all(query, [input.comment, input.id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send('ERROR! error message:' + err.message + ', query: ' + query)
    } else { res.status(200).send('success') }
  })
}

// ----------------------------------------------------------------------------
//  Methods for /projects/log/:id
// ----------------------------------------------------------------------------
router.route('/log/:id')
  .get((req, res) => {
    // precondition: project exists.
    let input = req.params.id

    if (input !== null) {
      // Get the project log
      getProjectLog(req, res, input)
    }
    // postcondition: the log entries of the project
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/search/:id
// ----------------------------------------------------------------------------

router.route('/search/:id')
  .get((req, res) => {
    // precondition: parameter is wellformed
    const query = `select * from projects where projectName LIKE "%${req.params.id}%"`
    console.log(query)
    req.db.all(query, (error, rows) => {
      if (error) {
        console.log(error)
        res.status(404)
        res.send('ERROR! error message:' + error.message + ', query: ' + query)
      } else {
        res.status(200)
        res.json(rows)
      }
    })
  })

module.exports = router

/**
 * Get a product.
 * @param {Object} req
 * @param {Object} res
 * @param {String} name
 * @param {String} version
 * @param {Integer} id
 * @param {JSON} callback
 */
function getProduct (req, res, name, version, id, callback) {
  let parameters
  let query = 'SELECT * FROM products WHERE '
  if (name !== null && version !== null) {
    query += 'productName = ? AND productVersion = ?;'
    parameters = [name, version]
  } else if (id !== null) {
    query += 'id = ?;'
    parameters = [id]
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else {
      callback(row)
    }
  })
}

/**
 * Get a project.
 * @param {Object} req
 * @param {Object} res
 * @param {String} name
 * @param {String} version
 * @param {Integer} id
 * @param {JSON} callback
 */
function getProject (req, res, name, version, id, callback) {
  let parameters
  let query = 'SELECT * FROM projects WHERE '
  if (name !== null && version !== null) {
    query += 'projectName = ? AND projectVersion = ?;'
    parameters = [name, version]
  } else if (id !== null) {
    query += 'id = ?;'
    parameters = [id]
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else {
      callback(row)
    }
  })
}

/**
 * Update a project.
 * @param {Object} req
 * @param {Object} res
 * @param {String} name
 * @param {String} version
 * @param {Integer} id
 * @param {Array} parametersText
 * @param {Array} parameters
 * @param {JSON} callback
 */
function updateProject (req, res, name, version, id, parametersText, parameters, callback) {
  let query = 'UPDATE projects SET '

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

  query += ' WHERE '
  if (name !== null && version !== null) {
    query += 'projectName = ? AND projectVersion = ?;'
    parameters.push(name)
    parameters.push(version)
  } else if (id !== null) {
    query += 'id = ?;'
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(query + ', ' + error.message)
      res.status(500).send(error.message)
    } else {
      callback(row)
    }
  })
}

/**
 * Insert a new row into projectLog.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 * @param {String} text
 * @param {Boolean} callback
 */
function insertProjectLog (req, res, id, text, callback) {
  let query = 'INSERT INTO projectLog (projectID, dateLogged, note) VALUES (?, ?, ?);'
  req.db.run(query, [id, new Date().toLocaleDateString(), text], (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
    } else {
      let t = true
      callback(t)
    }
  })
}

/**
 * Insert the update into the project Log.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 * @param {Array} approved
 * @param {String} comment
 */
function insertUpdateIntoLog (req, res, id, approved, comment) {
  // If the comment was changed then log it
  if (comment !== null) {
    insertProjectLog(req, res, id, 'Comment was changed to: ' + comment + '.', function (log) {
    })
  }
  // If approve has changed then log it
  if (req.body.hasOwnProperty('approved')) {
    if (approved[0] !== 0) {
      insertProjectLog(req, res, id, 'Product changed to not approved.', function (log) {
      })
    } else if (approved[0] !== 1) {
      insertProjectLog(req, res, id, 'Product changed to approved by ' + approved[1] + '.', function (log) {
      })
    }
  } else if (req.body.hasOwnProperty('approvedBy')) {
    // If approveBy has changed then log it
    if (approved[1] !== '') {
      insertProjectLog(req, res, id, 'Product changed to not approved.', function (log) {
      })
    } else if (approved[1] !== '') {
      insertProjectLog(req, res, id, 'Product changed to approved by ' + approved[1] + '.', function (log) {
      })
    }
  }
  res.status(204).send('Success!')
}

/**
 * Insert a product into a project.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} productID
 * @param {Integer} projectID
 * @param {Boolean} callback
 */
function insertProductIntoProject (req, res, productID, projectID, callback) {
  // Insert the product as a product of the project
  let query = 'INSERT INTO productsInProjects ( productID, projectID) VALUES (?, ?);'
  let parameters = [productID, projectID]
  req.db.run(query, parameters, (error) => {
    if (error) {
      console.log(error)
      res.status(500)
      res.send(error.message)
    } else {
      let t = true
      callback(t)
    }
  })
}

/**
 * Get projects connected with license.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getProjectsWithLicense (req, res, id) {
  let query = 'SELECT DISTINCT projectID AS id, projectName, projectVersion, dateCreated, lastEdited, comment FROM projects LEFT OUTER JOIN productsInProjects ON projects.id=productsInProjects.projectID' +
              ' LEFT OUTER JOIN componentsInProducts ON componentsInProducts.productID=productsInProjects.productID' +
              ' LEFT OUTER JOIN licensesInComponents ON licensesInComponents.componentID=componentsInProducts.componentID'

  query += ' WHERE licenseID = ?;'

  req.db.all(query, [id], (error, rows) => {
    if (error) {
      console.log(error)
      res.status(500).send(error.message)
    } else { res.send(rows) }
  })
}

/**
 * Get projects connected with component.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getProjectsWithComponent (req, res, id) {
  let query = 'SELECT DISTINCT projectID AS id, projectName, projectVersion, dateCreated, lastEdited, comment FROM projects LEFT OUTER JOIN productsInProjects ON projects.id=productsInProjects.projectID' +
              ' LEFT OUTER JOIN componentsInProducts ON componentsInProducts.productID=productsInProjects.productID'

  query += ' WHERE componentID = ?;'

  req.db.all(query, [id], (error, rows) => {
    if (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else {
      res.send(rows)
    }
  })
}

/**
 * Get projects connected with product.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getProjectsWithProduct (req, res, id) {
  let query = 'SELECT DISTINCT projectID AS id, projectName, projectVersion, dateCreated, lastEdited, comment FROM projects LEFT OUTER JOIN productsInProjects ON projects.id=productsInProjects.projectID'

  query += ' WHERE productID = ?;'

  req.db.all(query, [id], (error, rows) => {
    if (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else { res.send(rows) }
  })
}

/**
 * Get project log.
 * @param {Object} req
 * @param {Object} res
 * @param {Integer} id
 */
function getProjectLog (req, res, id) {
  let query = 'SELECT * FROM projectLog WHERE projectID = ?'

  req.db.all(query, [id], (error, rows) => {
    if (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else {
      res.send(rows)
    }
  })
}

router.route('/:id')
.get((req, res) => {
  let input = req.params.id
  const query = `SELECT * FROM projects WHERE id=${input}`
  req.db.get(query, (error, row) => {
    if (error) {
      console.log(error)
      res.status(404)
      res.send('ERROR! error message:' + error.message + ', query: ' + query)
    } else {
      res.status(200)
      res.json(row)
    }
  })
})

/**
 * Gets the project.
 * @param {Object} req
 * @param {Object} res
 * @param {JSON} input
 * @param {String} oldComment
 * @param {boolean} callback
 */
function setProjectLog (req, res, input, old, callback) {
  let query = 'INSERT INTO projectLog (projectID, dateLogged, note) VALUES (?, ?, ?);'
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
