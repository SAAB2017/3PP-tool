var express = require('express')
var router = express.Router()

// ----------------------------------------------------------------------------
//  Methods for /licenses
// ----------------------------------------------------------------------------
router.route('/')

  .get((req, res) => {
    req.db.all("SELECT * FROM licenses", (err, rows) => {
      res.json(rows)
    })
  })

  .post((req, res) => {
    res.status(405)
    res.send("Method not allowed")
  })

  // Add a license.
  // In order to add a new license; send in a JSON object with the applicable
  // parameters of which componentName and componentVersion must be provided.
  .put((req, res) => {

    // Check if licenseName and licenseVersion exist within input.
    // If they do not; send an error message and return.
    if (!req.body.hasOwnProperty("licenseName") || !req.body.hasOwnProperty("licenseVersion")) {
      res.status(500)
      res.send("ERROR: licenseName or licenseVersion wasn't provided.")

      return
    }

    // Everything ok? Continue...

    // Get the id of the to be created license.
    let licenseID = 1
    let queryGetID = "SELECT MAX(id) AS 'id' FROM licenses"
    req.db.get(queryGetID, [], (error, row) => {
      if (error) {
        // If there's an error then provide the error message and the different attributes that could have caused it.
        res.send("ERROR! error message:" + error.message + ", query: " + queryGetID)
      } else
        licenseID += row.id
    })

    // Construct SQL query based on input parameters.
    let query = "INSERT INTO licenses ("
    let values = []
    let parametarizedQuery = ""

    for (key in req.body) {
      query += key + ","
      values.push(req.body[key])
      parametarizedQuery += "?,"
    }

    // Remove trailing comma.
    query = query.slice(0, -1)
    parametarizedQuery = parametarizedQuery.slice(0, -1)

    // Combine all parts into one.
    query += ") VALUES (" + parametarizedQuery + ")"

    // Send the license to the database.
    req.db.run(query, values, (error) => {
      if (error) {
        console.log(error.message)
        res.status(500)
        res.send(error.message)
      } else {

        // Log the creation of the license.
        values = [licenseID, new Date().toDateString(), "License created."]
        query = "INSERT INTO licenseLog (licenseID, dateLogged, note) VALUES (?, ?, ?)"

        req.db.run(query, values, (error) => {
          if (error) {
            console.log(error.message)
            res.status(500)
            res.send(error.message)
          } else {
            res.status(201)
            res.send("success")
          }
        })
      }
    })
  })

  .delete((req, res) => {
    res.status(405)
    res.send("Method not allowed")
  })

// ----------------------------------------------------------------------------
//  Methods for /componentLicenses/:id
// ----------------------------------------------------------------------------
router.route('/licensesInComponent/:id')
  .get((req, res) => {
    console.log(req.params.id)
    let componentID = JSON.parse(req.params.id)
    console.log(componentID)
    let query = `SELECT licenseID, licenseName, licenseVersion, dateCreated, lastEdited, comment, URL FROM  licenses INNER JOIN licensesInComponents ON licenses.id=licensesInComponents.licenseID WHERE 
    componentID=${componentID}`
    req.db.all(query, (err, rows) => {
      res.json(rows)
    })
  })

// ----------------------------------------------------------------------------
//  Methods for /log/:id
// ----------------------------------------------------------------------------
router.route('/log/:id')
  .get((req, res) => {
    // precondition: license exists.
    let input = JSON.parse(req.params.id)
    let parametersText = Object.keys(input)
    let parameters = []

    if (input.id != null) {
      //Get the license log
      getLicenseLog(req, res, input.id)
    }
    // postcondition: the log entries of the license
  })
// ---------------------------------------------------------------------------- 
// Methods for /licensesInProduct/:id 
// ---------------------------------------------------------------------------- 
router.route('/licensesInProduct/:id')
  .get((req, res) => {
    // precondition: the product must exists and it must also be connected to atleast one component. 
    //This component must inturn be connected to a license. 
    let input = JSON.parse(req.params.id)
    let parametersText = Object.keys(input)
    let parameters = []
    if (input.id != null) {
      //Get licenses from the product 
      getLicensesFromProduct(req, res, input.id)
    }
    // postcondition: licenses connected to the product. 
  })
// ---------------------------------------------------------------------------- 
// Methods for /licensesInProject/:id 
// ---------------------------------------------------------------------------- 
router.route('/licensesInProject/:id').get((req, res) => {
  // precondition: the project must exists and it must also be connected to atleast one product. 
  //This product must inturn be connected to a component. 
  //Which also must be connected to a license. 
  let input = JSON.parse(req.params.id)
  let parametersText = Object.keys(input)
  let parameters = []
  if (input.id != null) {
    //Get licenses from the project 
    getLicensesFromProject(req, res, input.id)
  }
  // postcondition: licenses connected to the project. 
})

// ----------------------------------------------------------------------------
//  Methods for /licenses/:id
// ----------------------------------------------------------------------------
router.route('/:id')

  // Search for a license, or license attribute.
  // In order to search; send in a JSON object with the applicable parameters.
  .get((req, res) => {

    let input

    // Simple check for parse errors.
    try {
      input = JSON.parse(req.params.id)
    } catch (e) {
      res.status(500)
      res.send("JSON.parse try/catch statement failed")
      console.warn(e)
      return
    }

    // Construct SQL query based on input parameters.
    let query = "SELECT * FROM licenses WHERE "
    let values = []

    for (key in input) {
      query += key + " = ? AND "
      values.push(input[key])
    }

    // Remove trailing AND.
    query = query.slice(0, -5)

    req.db.all(query, values, (err, rows) => {
      if (err) {
        // If there's an error then provide the error message and the different attributes that could have caused it.
        res.send("ERROR! error message:" + err.message + ", query: " + query)
      } else
        res.json(rows)
    })
  })

  .post((req, res) => {

    res.status(405)
    res.send("Method not allowed")
  })

  .put((req, res) => {
    res.status(405)
    res.send("Method not allowed")
  })

  .delete((req, res) => {
    res.status(405)
    res.send("Method not allowed")
  })

//Get license log
function getLicenseLog(req, res, id) {
  let query = "SELECT * FROM licenseLog WHERE licenseID = ?"

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

//Get licenses from product
function getLicensesFromProduct(req, res, id) {

  let query = "SELECT DISTINCT licenseID AS id , licenseName, licenseVersion, dateCreated, lastEdited, comment FROM licenses LEFT OUTER JOIN"
    + " licensesInComponents ON licenses.id=licensesInComponents.licenseID LEFT OUTER JOIN componentsInProducts ON componentsInProducts.componentID=licensesInComponents.componentID"
    + " WHERE productID = ?;"

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it. 
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else
      res.json(rows)
  })
}

function getLicensesFromProject(req, res, id) {

  let query = "SELECT DISTINCT licenseID AS id , licenseName, licenseVersion, dateCreated, lastEdited, comment FROM licenses LEFT OUTER JOIN licensesInComponents ON licenses.id=licensesInComponents.licenseID"
              +" LEFT OUTER JOIN componentsInProducts ON componentsInProducts.componentID=licensesInComponents.componentID"
              +" LEFT OUTER JOIN productsInProjects ON productsInProjects.productID=componentsInProducts.productID"
    + " WHERE projectID = ?;"

  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it. 
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else
      res.json(rows)
  })
}
module.exports = router
