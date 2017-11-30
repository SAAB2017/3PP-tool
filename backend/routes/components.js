var express = require('express')
var router = express.Router()

// ----------------------------------------------------------------------------
//  Methods for /components
// ----------------------------------------------------------------------------
router.route('/')

  .get((req, res) => {
    let currentPage = 0
    if (typeof req.query.totalElements !== 'undefined') {
      const pageCountQuery = `select count(*) as rowCount from components`
      req.db.all(pageCountQuery, (err, rows) => {
        if (err) {
          console.log(err)
        } else {
          res.json(rows[0])
        }
      })
      return
    }
    if (typeof req.query.page !== 'undefined' && typeof req.query.amount !== 'undefined') {
      currentPage = +req.query.page
      const amount = +req.query.amount
      let offset = (currentPage) * amount
      const query = `SELECT * FROM components ORDER BY components.componentName LIMIT ${offset}, ${amount}`
      console.log(query)
      req.db.all(query, (err, rows) => {
        if (err) {
          console.log(err)
        } else {
          res.json(rows)
        }
      })
    } else {
      console.log("Motherfucker")
      req.db.all('SELECT * FROM components', (err, rows) => {
        if (err) {
          console.log(err)
        } else {
          res.json(rows)
        }
      })
    }

  })

// ----------------------------------------------------------------------------
//  Methods for /components/approve
// ----------------------------------------------------------------------------

function validateRequest(component, approved) {
  console.log("Validating data")
  return ((approved[0] == null && approved[1] == null) || ((component.approved == 1 && approved[0] == 0) || (component.approved != 1 && approved[1] != '')))
}

function getCorrectApproved(input) {
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

  //logic for correct approve/approvedBy
  if (approved[0] != null) {
    if (approved == 0 && approved[1] == null) {
      approved[1] = ''
    } else if (approved == 1 && approved[1] == null) {
      approved[0] = null
    }
  }
  return approved
}


router.route('/pending')
  .get((req, res) => {
    req.db.all("SELECT * FROM components where approved=0", (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        console.log(rows)
        res.json(rows)
      }
    })
  })

router.route('/approve')
  .put((req, res) => {
    // precondition: check that id == OK, signature == OK and that component hasn't yet been signed
    const input = req.body
    let approved = getCorrectApproved(input)

    //Get component to make sure that it is not approved already
    getComponent(req, res, null, null, input.id, function (component) {
      //Make sure that row is not null and that an approved component can't be approved again by a diffrent person
      if (component != null && input.id != null && validateRequest(component, approved)) {

        //update the component
        updateComponent(req, res, null, null, input.id, ['approved', 'approvedBy'], approved, function () {
          insertUpdateIntoLog(req, res, component.id, approved)
        })

      }//Else throw an error
      else {
        let message
        message = {
          "errorType": "alreadySigned",
          "byUser": "" + component.approvedBy
          //"onTime": "1510062744"
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
            res.send("ERROR! error message:" + error.message + ", query: " + query)
          } else {
            // Get the component so that the id can be extracted
            getComponent(req, res, req.body.componentName, req.body.componentVersion, null, function (component) {
              insertComponentLog(req, res, component.id, "Component created.",
                function (returnValue) {
                  licenses.forEach((license) => insertLicenseIntoComponent(req, res, license, component.id, (succeeded) => {
                    if (!succeeded) {
                      req.db.run('rollback')
                      res.status(500)
                      res.send('Error! Component was not found!')
                    }
                  }))
                  req.db.run('commit')
                  res.status(201).send("Success!")
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
      //Insert the provided license into the component
      insertLicenseIntoComponent(req, res, input.licenseID, input.componentID, function (returnValue) {
        //Get the license that was inserted
        getLicense(req, res, null, null, input.licenseID, function (license) {
          if (license == null) {
            message = {
              "errorType": "licenseDoesNotExist"
            }
            console.log(message)
            res.status(500).send(message)
          } else {
            //Create a log of the license added to the component
            insertComponentLog(req, res, input.componentID, "Added license: " + license.licenseName + " v" + license.licenseVersion + ".",
              function (returnValue) {
                updateComponent(req, res, null, null, input.componentID, ['approved', 'approvedBy'], ['0', ''], function (returnValue) {
                  res.status(200).send("Success")
                });
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
      //Get components from the product
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
      //Get components from the product
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
    //Get components from the product
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
    //Get the component log
    getComponentLog(req, res, input)
  }
  // postcondition: the log entries of the component
})

function validateSearchParameter(params) {
  return true;
}

// ----------------------------------------------------------------------------
//  Methods for /components/search/:id
// ----------------------------------------------------------------------------

router.route('/search/:id')
  .get((req, res) => {
  // precondition: parameter is wellformed
    const query = `select * from components where componentName LIKE "%${req.params.id}%"`
    console.log(query)
    req.db.all(query, (err, rows) => {
      if (err) {
        console.log(err)
        res.status(404)
        res.send("ERROR! error message:" + err.message + ", query: " + query)
      } else {
        res.status(200)
        console.log(rows)
        res.json(rows)
      }
    })
  })

// ----------------------------------------------------------------------------
//  Methods for /components/:id
// ----------------------------------------------------------------------------
router.route('/:id')

  // In order to search; send in a JSON object with the applicable parameters.
  .get((req, res) => {
    let input = req.params.id
    const query = `SELECT * FROM components WHERE id=${input}`
    req.db.get(query, (err, row) => {
      if (err) {
        console.log(err)
        res.status(404)
        res.send("ERROR! error message:" + err.message + ", query: " + query)
      } else {
        res.status(200)
        res.json(row)
      }
    })
  })

function getComponent(req, res, componentName, componentVersion, id, callback) {
  let query = "SELECT * FROM components"
  let parameters = []
  if (componentName != null && componentVersion != null) {
    query += " WHERE componentName = ? AND componentVersion = ?;"
    parameters.push(componentName)
    parameters.push(componentVersion)
  } else if (id != null) {
    query += " WHERE id = ?;"
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
    } else {
      if (row != null) {
        callback(row);
      } else callback(null);
    }
  })
}

//Get component in product
function getComponentsFromProduct(req, res, id) {
  let query = "SELECT componentID AS id , componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy "
    + "FROM "
    + "components "
    + "INNER JOIN "
    + "componentsInProducts "
    + "ON "
    + "components.id=componentsInProducts.componentID "
    + "WHERE "

  query += "productID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else {
      console.log(rows)
      res.json(rows)
    }
  })
}

//Get component in project
function getComponentsFromProject(req, res, id) {
  let query = "SELECT DISTINCT componentID AS id, componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy FROM components LEFT OUTER JOIN componentsInProducts ON components.id=componentsInProducts.componentID" +
  " LEFT OUTER JOIN productsInProjects ON productsInProjects.productID=componentsInProducts.productID WHERE "

query += "projectID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else
      res.send(rows)
  })
}

//Get components with license
function getComponentsWithLicense(req, res, id) {
  let query = "SELECT componentID AS id , componentName, componentVersion, dateCreated, lastEdited, comment, approved, approvedBy "
    + "FROM "
    + "components "
    + "INNER JOIN "
    + "licensesInComponents "
    + "ON "
    + "components.id=licensesInComponents.componentID "
    + "WHERE "

  query += "licenseID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else {
      res.json(rows)
    }
  })
}

//Update the component
function updateComponent(req, res, componentName, componentVersion, id, parametersText, parameters, callback) {
  let query = "UPDATE components SET "

  //Construct the remaining SQL query
  let first = false;
  for (let i = 0; i < parametersText.length; i++) {
    if (!first) {
      first = true
      query += parametersText[i] + " = ?"
    } else {
      query += ", " + parametersText[i] + " = ?"
    }
  }

  //Check if either componentName/componentVersion or id was provided and use them one find the row to alter
  if (componentName != null && componentVersion != null) {
    query += " WHERE componentName = ? AND componentVersion = ?;"
    parameters.push(componentName)
    parameters.push(componentVersion)
  } else if (id != null) {
    query += " WHERE id = ?;"
    parameters.push(id)
  }

  req.db.run(query, parameters, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
    } else {
      callback(true)
    }
  })
}

//insert a license into a component
function insertLicenseIntoComponent(req, res, licenseID, componentID, callback) {
  //Insert the license as a license of the component
  let query = "INSERT INTO licensesInComponents ( licenseID, componentID) VALUES (?, ?);"
  let parameters = [licenseID, componentID]
  req.db.run(query, parameters, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
    } else {
      callback(true);
    }
  })
}

//Get a license
function getLicense(req, res, licenseName, licenseVersion, id, callback) {
  let query = "SELECT * FROM licenses"
  let parameters = []
  if (licenseName != null && licenseVersion != null) {
    query += " WHERE licenseName = ? AND licenseVersion = ?;"
    parameters.push(licenseName)
    parameters.push(licenseVersion)
  } else if (id != null) {
    query += " WHERE id = ?;"
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
    } else {
      if (row != null) {
        callback(row);
      } else callback(null);
    }
  })
}

//Insert a new row into componentLog
function insertComponentLog(req, res, id, text, callback) {
  let parametersLog = [id, new Date().toLocaleDateString(), text]
  let queryLog = "INSERT INTO componentLog (componentID, dateLogged, note) VALUES (?, ?, ?);"
  req.db.run((queryLog), parametersLog, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
    } else {
      callback(true);
    }
  })
}

//Insert the update into the ComponentLog
function insertUpdateIntoLog(req, res, correctInputId, approved, comment) {

  //If the comment was changed then log it
  if(comment != null){
    insertComponentLog(req, res, correctInputId, "Comment was changed to: " + comment + ".", function (log) {
    })
  }
  //If approve has changed then log it
  if (req.body.hasOwnProperty('approved')) {
    if (approved[0] == 0) {
      insertComponentLog(req, res, correctInputId, "Component changed to not approved.", function (log) {
      })
    } else if (approved[0] == 1) {
      insertComponentLog(req, res, correctInputId, "Component changed to approved by " + approved[1] + ".", function (log) {
      })
    }
  }//If approveBy has changed then log it
  else if (req.body.hasOwnProperty('approvedBy')) {
    if (approved[1] == '') {
      insertProductLog(req, res, correctInputId, "Component changed to not approved.", function (log) {
      })
    } else if (approved[1] != '') {
      insertComponentLog(req, res, correctInputId, "Component changed to approved by " + approved[1] + ".", function (log) {
      })
    }
  }
  res.status(204).send('success')
}

//Get component log
function getComponentLog(req, res, id){
  let query = "SELECT * FROM componentLog WHERE componentID = ?"

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


module.exports = router
