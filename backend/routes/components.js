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

  // In order to get a specific component or a specific group of components based on
  // search parameters; this method must be called with an identifier constructed as follows:
  // Example search identifier: "componentName=Test Components"
  // Between each provided parameter there must be an '&' character. Aside from that
  // the order of provided parameters makes no difference.
  // -------------------------------
  // To enable partial word searches simply provide another parameter called 'smartSearch'
  // Example: 'smartSearch&componentName=Test'
  // -------------------------------
  .get((req, res) => {

    var query = "SELECT * FROM components WHERE "
    var parameters = []
    var values = []
    var valuesText = []

    var inputString = req.params.id.split("&")

    // Check if smartSearch.
    var smartSearch = false
    for (var i = 0; i < inputString.length; i++) {
      if (inputString[i] == 'smartSearch') smartSearch = true
    }

    // Get search parameters from input.
    for (var i = 0; i < inputString.length; i++) {
      if (inputString[i] != 'smartSearch') {
        var tempHolder = inputString[i].split("=")
        valuesText.push(tempHolder[0])
        if (smartSearch) values.push('%' + tempHolder[1] + '%')
        else values.push(tempHolder[1])
      }
    }

    // Construct remaining SQL query based on search parameters.
    var first = false
    for (var i = 0; i < valuesText.length; i++) {
      if (values[i] != null) {
        if (!first) {
          first = true
          if (smartSearch) query += "" + valuesText[i] + " LIKE ? "
          else query += "" + valuesText[i] + " = ? "
        } else {
          if (smartSearch) query += "AND " + valuesText[i] + " LIKE ? "
          else query += "AND " + valuesText[i] + " = ? "
        }
        parameters.push(values[i])
      }
    }

    req.db.all(query, parameters, (err, rows) => {
      if (err) {
        // If there's an error then provide the error message and the different attributes that could have caused it.
        res.send("ERROR! error message:" + err.message + " Input: " + inputString + ", query: " + query + ", values: " + values + ", valuesText: " + valuesText)
      } else
        res.json(rows)
    })
  })

  // In order to alter a specific component or a specific group of components based on
  // certain parameters then this methis is to be used; this method must be called with an identifier constructed as follows:
  // Example input identifier: "componentName=Test Components&licenseVersion=1.0&comment=Here's a new comment!"
  // Between each provided parameter there must be an '&' character. Aside from that
  // the order of provided parameters makes no difference.
  .post((req, res) => {
    var values = []
    var valuesText = []

    var inputString = req.params.id.split("&")
    //Get input parameters from the input.
    for (var i = 0; i < inputString.length; i++) {
      var tempHolder = inputString[i].split("=")
      valuesText.push(tempHolder[0])
      values.push(tempHolder[1])
    }

    var correctInputComponentName = null
    var correctInputComponentVersion = null
    var date = [null, false]
    //Make sure that there is a componentName and componentVersion provided. Also checks if dateCreated and lastEdited is provided.
    for (var i = 0; i < valuesText.length; i++) {
      if (valuesText[i] == 'componentName') {
        correctInputComponentName = values[i]
      } else if (valuesText[i] == 'componentVersion') {
        correctInputComponentVersion = values[i]
      } else if (valuesText[i] == 'dateCreated') {
        date[0] = i
        values[date[0]] = new Date().toDateString()
      } else if (valuesText[i] == 'lastEdited') {
        values[i] = new Date().toDateString()
        date[1] = true
      }
    }

    //If dateCreated was provided then remove it.
    if (date[0] != null) {
      var tempValuesArray = []
      var tempValuesTextArray = []
      for (var i = 0; i < valuesText.length; i++) {
        if (i != date[0]) {
          tempValuesTextArray.push(valuesText[i])
          tempValuesArray.push(values[i])
        }
      }
      value = tempValuesArray
      valuesText = tempValuesTextArray
    }

    //If lastEdited wasn't provided then provide it.
    if (!date[1]) {
      valuesText.push('lastEdited')
      if (values.length < valuesText.length) values.push(new Date().toDateString())
    }

    //Make sure the necessary data is provided
    if (correctInputComponentName != null && correctInputComponentVersion != null) {
      
      var query = "UPDATE components SET "
      var parameters = []
      //Construct remaining SQL query based on input parameters.
      var first = false;
      for (var i = 0; i < valuesText.length; i++) {
        if (values[i] != null && valuesText[i] != 'licenseID') {
          if (!first) {
            first = true
            query += "" + valuesText[i] + " = ?"
          } else {
            query += ", " + valuesText[i] + " = ?"
          }
          parameters.push(values[i])
        }
      }
      query += " WHERE componentName = ? AND componentVersion = ?;"
      parameters.push(correctInputComponentName)
      parameters.push(correctInputComponentVersion)

      req.db.run(query, parameters, (error) => {
        if (error) {
          console.log("1: " + error.message)
          res.status(500)
          res.send("ERROR! error message:" + error.message + " Input: " + inputString + ", query: " + query + ", values: " + values + ", valuesText: " + valuesText)
        } else {
          res.status(200)
          res.send("Success!")
        }
      })
    }
  })

  //In order to add a new component then
  //this method must be called with an identifier constructed as following:
  //(componentName, componentVersion and licenseID must be provided, everything else is optional)
  //Example component identifier: "componentName=component&componentVersion=1.0&licenseID=2"
  //Between each parameter proveded there must be a '&' but, other than that, the order of provided
  //parameters makes no difference.
  .put((req, res) => {
    var parametersInsert = []
    var values = []
    var valuesText = []

    var inputString = req.params.id.split("&")
    //Get input parameters from the input 
    for (var i = 0; i < inputString.length; i++) {
      var tempHolder = inputString[i].split("=")
      valuesText.push(tempHolder[0])
      values.push(tempHolder[1])
    }

    var correctInputComponentName = null
    var correctInputComponentVersion = null
    var correctInputLicenseID = null
    var date = [false, false]
    //Make sure that there is a componentName, componentVersion and licenseID provided. Also checks if dateCreated and lastEdited is provided.
    for (var i = 0; i < valuesText.length; i++) {
      if (valuesText[i] == 'componentName') {
        correctInputComponentName = values[i]
      } else if (valuesText[i] == 'componentVersion') {
        correctInputComponentVersion = values[i]
      } else if (valuesText[i] == 'licenseID') {
        correctInputLicenseID = values[i]
      } else if (valuesText[i] == 'dateCreated') {
        values[i] = new Date().toDateString()
        date[0] = true
      } else if (valuesText[i] == 'lastEdited') {
        values[i] = new Date().toDateString()
        date[1] = true
      }
    }
    //If dateCreated wasn't provided then provide it
    if (!date[0]) {
      valuesText.push('dateCreated')
      values.push(new Date().toDateString())
    }
    //If lastEdited wasn't provided then provide it
    if (!date[1]) {
      valuesText.push('lastEdited')
      values.push(new Date().toDateString())
    }

    //Make sure the necessary parameters are provided.
    if (correctInputComponentName != null && correctInputComponentVersion != null && correctInputLicenseID != null) {

      //Check if the component already exists. If it exists already then store it's values so they can be inserted along licenseID into a new row.
      var currentRow = null
      var queryExists = "SELECT * FROM components WHERE componentName = ? AND componentVersion = ?"
      var parametersExists = [correctInputComponentName, correctInputComponentVersion]
      req.db.get(queryExists, parametersExists, (error, row) => {
        if (error) {
          //If there's an error then provide the error message and the different attributes that could have caused it. 
          res.send("ERROR! error message:" + error.message + " Input: " + inputString + ", query: " + queryGetID + ", values: " + values + ", valuesText: " + valuesText)
        } else {
          currentRow = row

          if (currentRow != null) { //Component exists. Relevant data need to be inserted along with the licenseID.
            values = [currentRow.componentName, currentRow.componentVersion, correctInputLicenseID, new Date().toDateString(), new Date().toDateString(), currentRow.comment, currentRow.approved, currentRow.approvedBy]
            valuesText = ['componentName', 'componentVersion', 'licenseID', 'dateCreated', 'lastEdited', 'comment', 'approved', 'approvedBy']

            var queryInsert = "INSERT OR IGNORE INTO components ( "
            //Construct remaining SQL query based on input parametersInsert
            for (var j = 0; j < 2; j++) {
              for (var i = 0; i < valuesText.length; i++) {
                if (values[i] != null) {
                  if (i == (0)) {
                    if (j == 0) {
                      queryInsert += " " + valuesText[i] + " "
                      parametersInsert.push(values[i])
                    } else queryInsert += " ? "
                  } else {
                    if (j == 0) {
                      queryInsert += ", " + valuesText[i] + ""
                      parametersInsert.push(values[i])
                    } else queryInsert += ", ? "
                  }
                }
              }
              if (j == 0) {
                queryInsert += ") VALUES ("
              } else queryInsert += ");"
            }

            req.db.run(queryInsert, parametersInsert, (error) => {
              if (error) {
                console.log("1: " + error.message)
                res.status(500)
                res.send("ERROR! error message:" + error.message + " Input: " + inputString + ", query: " + queryInsert + ", values: " + values + ", valuesText: " + valuesText)
              }
            })

          } else { //Component dosen't exist.

            var componentID = 1
            //Get the id of the to be created component.
            var queryGetID = "SELECT MAX(id) AS 'id' FROM components"
            req.db.get(queryGetID, [], (error, rowID) => {
              if (error) {
                //If there's an error then provide the error message and the different attributes that could have caused it. 
                res.send("ERROR! error message:" + error.message + " Input: " + inputString + ", query: " + queryGetID + ", values: " + values + ", valuesText: " + valuesText)
              } else
                componentID += rowID.id
              var queryInsert = "INSERT OR IGNORE INTO components ( "
              //Construct remaining SQL query based on input parametersInsert
              for (var j = 0; j < 2; j++) {
                for (var i = 0; i < valuesText.length; i++) {
                  if (values[i] != null) {
                    if (i == (valuesText.length - 1)) {
                      if (j == 0) {
                        queryInsert += "" + valuesText[i] + " "
                        parametersInsert.push(values[i])
                      } else queryInsert += "? "
                    } else {
                      if (j == 0) {
                        queryInsert += "" + valuesText[i] + ", "
                        parametersInsert.push(values[i])
                      } else queryInsert += "?, "
                    }
                  }
                }
                if (j == 0) {
                  queryInsert += ") VALUES ("
                } else queryInsert += ");"
              }

              req.db.run(queryInsert, parametersInsert, (error) => {
                if (error) {
                  console.log("1: " + error.message)
                  res.status(500)
                  res.send("ERROR! error message:" + error.message + " Input: " + inputString + ", query: " + queryInsert + ", values: " + values + ", valuesText: " + valuesText)
                }
              })
            })
          }

          //Make sure a new componentLog isn't created if the component already existed
          setTimeout(function () {
            var query = "SELECT * FROM components WHERE componentName = ? AND componentVersion = ? and licenseID = ?;"
            var parameters = [correctInputComponentName, correctInputComponentVersion, correctInputLicenseID]
            req.db.get(query, parameters, (error, row) => {
              if (error) {
                console.log("1: " + error.message)
                res.status(500)
                res.send("ERROR! error message:" + error.message + " Input: " + inputString + ", query: " + queryInsert + ", values: " + values + ", valuesText: " + valuesText)
              } else {
                if (row != null) {
                  query = "SELECT * FROM componentLog WHERE componentID = ? AND note = ?;"
                  parameters = [row.id, "Component created."]
                  req.db.get(query, parameters, (error, rowLog) => {
                    if (error) {
                      console.log(error.message)
                      res.status(500)
                      res.send(error.message)
                    } else {
                      if (rowLog == null) {
                        //Log the creation of the component
                        var parametersLog = [row.id, new Date().toDateString(), "Component created."]
                        var queryLog = "INSERT INTO componentLog (componentID, dateLogged, note) VALUES (?, ?, ?);"
                        req.db.run((queryLog), parametersLog, (error) => {
                          if (error) {
                            console.log(error.message)
                            res.status(500)
                            res.send(error.message)
                          } else {
                            res.status(201)
                            res.send("Success!")
                          }
                        })
                      } else {
                        res.status(412)
                        res.send("ERROR: Component already exists.")
                      }
                    }
                  })
                } else {
                  res.status(412)
                  res.send("ERROR: Provided parameters are not either not unique or not valid. Please check provided parameters and try again.")
                }
              }
            })
          }, 100)
        }
      })

    } else {
      res.status(412)
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
