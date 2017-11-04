var express = require('express')
var router = express.Router()

// ----------------------------------------------------------------------------
//  Methods for /components
// ----------------------------------------------------------------------------
router.route('/')

  .get((req, res) => {
    req.db.all("SELECT * FROM components", (err, rows) => {
      res.json(rows)
    })
  })

  .post((req, res) => {
    var component = req.body.component
    var version = req.body.version

    var query = "INSERT INTO components (component, version) VALUES (?, ?)"

    var parameters = [component, version]

    req.db.run(query, parameters, (error) => {
      if (error) {
        console.log(error.message)
        res.status(500)
        res.end()
      } else {
        res.status(201)
        res.send("success")
      }
    })
  })

  // TODO - implement


  // TODO - implement
  .delete((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

// ----------------------------------------------------------------------------
//  Methods for /components/:id
// ----------------------------------------------------------------------------
router.route('/:id')

  .get((req, res) => {
    var query = "SELECT * FROM components WHERE id = ?"
    var id = req.params.id

    req.db.get(query, [id], (err, row) => {
      res.json(row)
    })
  })

  .post((req, res) => {
    res.status(405)
    res.send("Method not allowed")
  })

  //In order to add a new component then
  //this method must be called with an identifier constructed as following:
  //(componentName, componentVersion and licenseID must be provided, everything else is optional)
  //Example component identifier: "componentName=component&componentVersion=1.0&licenseID=2"
  //Between each parameter proveded there must be a '&' but, other than that, the order of provided
  //parameters makes no difference. 
  .put((req, res) => {
    var query = "INSERT INTO components ( "
    var parameters = []
    var values = []
    var valuesText = []

    var inputString = req.params.id.split("&")
    //Get input parameters from the input 
    for (var i = 0; i < inputString.length; i++) {
      var tempHolder = inputString[i].split("=")
      valuesText.push(tempHolder[0])
      values.push(tempHolder[1])
    }

    var correctInputComponentName = false
    var correctInputComponentVersion = false
    var correctInputLicenseID = false
    //Make sure that there is a componentName, componentVersion and licenseID provided
    for (var i = 0; i < valuesText.length; i++) {
      if (valuesText[i] == 'componentName') {
        correctInputComponentName = true
      } else if (valuesText[i] == 'componentVersion') {
        correctInputComponentVersion = true
      } else if (valuesText[i] == 'licenseID') {
        correctInputLicenseID = true
      }
    }

    if (correctInputComponentName && correctInputComponentVersion && correctInputLicenseID) {
      //Construct remaining SQL query based on input parameters
      for (var j = 0; j < 2; j++) {
        for (var i = 0; i < valuesText.length; i++) {
          if (values[i] != null) {
            if (i == (valuesText.length - 1)) {
              if (j == 0) {
                query += "" + valuesText[i] + " "
                parameters.push(values[i])
              } else query += "? "
            } else {
              if (j == 0) {
                query += "" + valuesText[i] + ", "
                parameters.push(values[i])
              } else query += "?, "
            }
          }
        }
        if (j == 0) {
          query += ") VALUES ("
        } else query += ")"
      }


      req.db.run(query, parameters, (error) => {
        if (error) {
          console.log(error.message)
          res.status(500)
          res.send(error.message)
        } else {
          res.status(201)
          res.send("success")
        }
      })

      var componentID
      //Get the id of the newly created component
      query = "SELECT id FROM components WHERE componentName = ? AND componentVersion = ? "
      parameters = [null, null]
      for (var i = 0; i < valuesText.length; i++) {
        if (valuesText[i] == 'componentName') parameters[0] = values[i]
        else if (valuesText[i] == 'componentVersion') parameters[1] = values[i]
      }
      req.db.get(query, parameters, (err, row) => {
        if (err) {
          //If there's an error then provide the error message and the different attributes that could have caused it. 
          res.send("ERROR! error message:" + err.message + " Input: " + inputString + ", query: " + query + ", values: " + values + ", valuesText: " + valuesText)
        } else
          componentID = row
      })

      //Log the creation of the license
      parameters = [componentID, new Date().toDateString(), "Component created."]
      query = "INSERT INTO componentLog (componentID, dateLogged, note) VALUES (?, ?, ?)"

      req.db.run(query, parameters, (error) => {
        if (error) {
          console.log(error.message)
          res.status(500)
          res.send(error.message)
        } else {
          res.status(201)
          res.send("success")
        }
      })

    } else {
      res.status(500)
      res.send("ERROR: componentName, componentVersion, or licenseID wasn't provided.")
    }
  })

  .delete((req, res) => {
    var query = "DELETE FROM components WHERE id = ?"
    var id = req.params.id

    req.db.get(query, [id], (err, row) => {
      res.status(200)
      res.send("Component deleted")
    })
  })

module.exports = router
