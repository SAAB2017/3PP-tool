var express = require('express')
var router = express.Router()

// ----------------------------------------------------------------------------
//  Methods for /projects
// ----------------------------------------------------------------------------
router.route('/')

  .get((req, res) => {
    req.db.all("SELECT * FROM projects", (err, rows) => {
      res.json(rows)
    })
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/approve
// ----------------------------------------------------------------------------

function validateRequest(project, approved) {
  return ((approved[0] == null && approved[1] == null) || ((project.approved == 1 && approved[0] == 0) || (project.approved != 1 && approved[1] != '')))
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

router.route('/approve')
  .put((req, res) => {
    // precondition: check that id == OK, signature == OK and that the project hasn't yet been signed
    const input = req.body
    let approved = getCorrectApproved(input)

    //Get project to make sure that it is not approved already
    getProject(req, res, null, null, input.id, function (project) {
      //Make sure that row is not null and that an approved project can't be approved again by a diffrent person
      if (project != null && input.id != null && validateRequest(project, approved)) {

        //update the project
        updateProject(req, res, null, null, input.id, ['approved', 'approvedBy'], approved, function () {
          insertUpdateIntoLog(req, res, project.id, approved, null)
        })

      }//Else throw an error
      else {
        let message
        message = {
          "errorType": "alreadySigned",
          "byUser": "" + project.approvedBy
          //"onTime": "1510062744"
        }
        console.log(message)
        res.status(500).send(message)
      }
    })
    // postcondition: project approved, signed and logged
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/add
// ----------------------------------------------------------------------------
router.route('/add')
  .post((req, res) => {
    // precondition: project doesn't already exist.
    const input = req.body
    parametersText = []
    parameters = []

    //Get the correct parameters
    getInsertProjectParameters(req, parametersText, parameters, function (returnValue) {
      parametersText = returnValue[0]
      parameters = returnValue[1]

      //Make sure the necessary parameters are provided to insert a new project.
      if (input.projectName != null && input.projectVersion != null) {

        insertNewProject(req, res, parametersText, parameters, function (returnValue) {
          //Get the project so that the id can be extracted
          getProject(req, res, input.projectName, input.projectVersion, null, function (project) {
            insertProjectLog(req, res, project.id, "Project created.",
              function (returnValue) {
                res.status(201).send("Success!")
              })
          })
        })

      }
    })
    // postcondition: project created and logged.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/connectProductWithProject
// ----------------------------------------------------------------------------
router.route('/connectProductWithProject')
  .post((req, res) => {
    // precondition: Product must exist aswell as the project.
    const input = req.body

    if (input.projectID != null && input.productID != null) {
      //Insert the provided license into the product
      insertProductIntoProject(req, res, input.productID, input.projectID, function (returnValue) {
        //Get the product that was inserted
        getProduct(req, res, null, null, input.productID, function (product) {
          if (product == null) {
            message = {
              "errorType": "productDoesNotExist"
            }
            console.log(message)
            res.status(500).send(message)
          } else {
            //Create a log of the product added to the project
            insertProjectLog(req, res, input.projectID, "Added product: " + product.productName + " v" + product.productVersion + ".",
              function (returnValue) {
                updateProject(req, res, null, null, input.projectID, ['approved', 'approvedBy'], ['0', ''], function (returnValue) {
                  res.status(200).send("Success")
                });
              })
          }
        })
      })
    }
    // postcondition: The product is connected with the project.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/projectstWithLicense/:id
// ----------------------------------------------------------------------------
router.route('/projectstWithLicense/:id')
  .get((req, res) => {
    // precondition: license exists and is connected with atleast one project.
    let input = JSON.parse(req.params.id)

    if (input.id != null) {
      //Get projects connected to the license
      getProjectsWithLicense(req, res, input.id)
    }
    // postcondition: projects with the license connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/projectstWithComponent/:id
// ----------------------------------------------------------------------------
router.route('/projectsWithComponent/:id')
  .get((req, res) => {
    // precondition: component exists and is connected with atleast one project.
    let input = JSON.parse(req.params.id)

    if (input.id != null) {
      //Get projects connected to the component
      getProjectsWithComponent(req, res, input.id)
    }
    // postcondition: projects with the components connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/projectstWithProduct/:id
// ----------------------------------------------------------------------------
router.route('/projectstWithProduct/:id')
  .get((req, res) => {
    // precondition: product exists and is connected with atleast one project.
    let input = JSON.parse(req.params.id)

    if (input.id != null) {
      //Get projects connected to the product
      getProjectsWithProduct(req, res, input.id)
    }
    // postcondition: projects with the product connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/log/:id
// ----------------------------------------------------------------------------
router.route('/log/:id')
  .get((req, res) => {
    // precondition: project exists.
    let input = JSON.parse(req.params.id)
    let parametersText = Object.keys(input)
    let parameters = []

    if (input.id != null) {
      //Get the project log
      getProjectLog(req, res, input.id)
    }
    // postcondition: the log entries of the project
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/search/:id
// ----------------------------------------------------------------------------
router.route('/search/:id')

  .get((req, res) => {
    let input = JSON.parse(req.params.id)
    let parametersText = Object.keys(input)
    let parameters = []

    getProjectFromParameters(req, res, input, parametersText, parameters)

  })

module.exports = router

//Get a product
function getProduct(req, res, name, version, id, callback) {
  let parameters
  let query = "SELECT * FROM products WHERE "
  if (name != null && version != null) {
    query += "productName = ? AND productVersion = ?;"
    parameters = [name, version]
  } else if (id != null) {
    query += "id = ?;"
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

//Get a project
function getProject(req, res, name, version, id, callback) {
  let parameters
  let query = "SELECT * FROM projects WHERE "
  if (name != null && version != null) {
    query += "projectName = ? AND projectVersion = ?;"
    parameters = [name, version]
  } else if (id != null) {
    query += "id = ?;"
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

//Update a project
function updateProject(req, res, name, version, id, parametersText, parameters, callback) {
  let query = "UPDATE projects SET "

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

  query += " WHERE "
  if (name != null && version != null) {
    query += "projectName = ? AND projectVersion = ?;"
    parameters.push(name)
    parameters.push(version)
  } else if (id != null) {
    query += "id = ?;"
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(query + ", " + error.message)
      res.status(500).send(error.message)
    } else {
      callback(row)
    }
  })
}


//Insert a new row into projectLog
function insertProjectLog(req, res, id, text, callback) {
  let query = "INSERT INTO projectLog (projectID, dateLogged, note) VALUES (?, ?, ?);"
  req.db.run(query, [id, new Date().toLocaleDateString(), text], (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
    } else {
      callback(true);
    }
  })
}

//Get parameters
function getInsertProjectParameters(req, parametersText, parameters, callback) {
  let date = [false, false]

  //Check if componentName was provided
  if (req.body.hasOwnProperty('projectName')) {
    parameters.push(req.body.projectName)
    parametersText.push('projectName')
  }
  //Check if componentVersion was provided
  if (req.body.hasOwnProperty('projectVersion')) {
    parameters.push(req.body.projectVersion)
    parametersText.push('projectVersion')
  }
  //Check if dateCreated was provided
  if (req.body.hasOwnProperty('dateCreated')) {
    parameters.push(new Date().toLocaleDateString())
    parametersText.push('dateCreated')
    date[0] = true
  }
  //Check if lastEdited was provided
  if (req.body.hasOwnProperty('lastEdited')) {
    parameters.push(new Date().toLocaleDateString())
    parametersText.push('lastEdited')
    date[1] = true
  }
  //Check if comment was provided
  if (req.body.hasOwnProperty('comment')) {
    parameters.push(req.body.comment)
    parametersText.push('comment')
  }
  //Set approved/approvedBy as default values
  parameters.push(0)
  parametersText.push('approved')
  parameters.push('')
  parametersText.push('approvedBy')

  //If dateCreated wasn't provided then provide it
  if (!date[0]) {
    parametersText.push('dateCreated')
    parameters.push(new Date().toLocaleDateString())
  }
  //If lastEdited wasn't provided then provide it
  if (!date[1]) {
    parametersText.push('lastEdited')
    parameters.push(new Date().toLocaleDateString())
  }
  let obj = [parametersText, parameters]
  callback(obj);
}

//Insert a new Project
function insertNewProject(req, res, parametersText, parameters, callback) {
  let query = "INSERT INTO projects ( "

  //Construct the remaining SQL query
  for (let j = 0; j < 2; j++) {
    let first = false;
    for (let i = 0; i < parametersText.length; i++) {
      if (!first) {
        first = true
        if (j == 0) query += parametersText[i]
        else query += "?"
      } else {
        if (j == 0) query += ", " + parametersText[i]
        else query += ", ?"
      }
    }
    if (j == 0) {
      query += ") VALUES ("
    } else query += ");"
  }

  req.db.run(query, parameters, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else {
      callback(true)
    }
  })
}

//Insert the update into the project Log
function insertUpdateIntoLog(req, res, id, approved, comment) {
  //If the comment was changed then log it
  if (comment != null) {
    insertProjectLog(req, res, correctInputId, "Comment was changed to: " + comment + ".", function (log) {
    })
  }
  //If approve has changed then log it
  if (req.body.hasOwnProperty('approved')) {
    if (approved[0] == 0) {
      insertProjectLog(req, res, id, "Product changed to not approved.", function (log) {
      })
    } else if (approved[0] == 1) {
      insertProjectLog(req, res, id, "Product changed to approved by " + approved[1] + ".", function (log) {
      })
    }
  }//If approveBy has changed then log it
  else if (req.body.hasOwnProperty('approvedBy')) {
    if (approved[1] == '') {
      insertProjectLog(req, res, id, "Product changed to not approved.", function (log) {
      })
    } else if (approved[1] != '') {
      insertProjectLog(req, res, id, "Product changed to approved by " + approved[1] + ".", function (log) {
      })
    }
  }
  res.status(201).send("Success!")
}

//insert a product into a project
function insertProductIntoProject(req, res, productID, projectID, callback) {
  //Insert the product as a product of the project
  let query = "INSERT INTO productsInProjects ( productID, projectID) VALUES (?, ?);"
  let parameters = [productID, projectID]
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

//Get projects connected with license
function getProjectsWithLicense(req, res, id) {
  let query = "SELECT DISTINCT projectID AS id, projectName, projectVersion, dateCreated, lastEdited, comment FROM projects LEFT OUTER JOIN productsInProjects ON projects.id=productsInProjects.projectID"
              + " LEFT OUTER JOIN componentsInProducts ON componentsInProducts.productID=productsInProjects.productID"
              + " LEFT OUTER JOIN licensesInComponents ON licensesInComponents.componentID=componentsInProducts.componentID"

  query += " WHERE licenseID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else
      res.send(rows)
  })
}

//Get projects connected with component
function getProjectsWithComponent(req, res, id) {
  let query = "SELECT DISTINCT projectID AS id, projectName, projectVersion, dateCreated, lastEdited, comment FROM projects LEFT OUTER JOIN productsInProjects ON projects.id=productsInProjects.projectID"
              + " LEFT OUTER JOIN componentsInProducts ON componentsInProducts.productID=productsInProjects.productID"

  query += " WHERE componentID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else
      res.send(rows)
  })
}

//Get projects connected with product
function getProjectsWithProduct(req, res, id) {
  let query = "SELECT DISTINCT projectID AS id, projectName, projectVersion, dateCreated, lastEdited, comment FROM projects LEFT OUTER JOIN productsInProjects ON projects.id=productsInProjects.projectID"

  query += " WHERE productID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else
      res.send(rows)
  })
}

//Get project log
function getProjectLog(req, res, id){
  let query = "SELECT * FROM projectLog WHERE projectID = ?"

  req.db.all(query, [id], (error, rows) => {
    if (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else {
      res.send(rows)
    }
  })
}

//Get project from parameters
function getProjectFromParameters(req, res, input, parametersText, parameters) {
  let query = "SELECT * FROM projects WHERE "

  let first = false;
  for (let i = 0; i < parametersText.length; i++) {
    if (!first) {
      first = true;
      query += parametersText[i] + " = ?"
    } else {
      query += " AND " + parametersText[i] + " = ?"
    }
    parameters.push(input[parametersText[i]])
  }

  req.db.all(query, parameters, (err, rows) => {
    if (err) {
      console.log(error.message)
      res.status(500).send(error.message)
    } else
      res.json(rows)
  })
}

router.route('/:id')
.get((req, res) => {
  let input = req.params.id
  const query = `SELECT * FROM projects WHERE id=${input}`
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
