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

  // In order to search; send in a JSON object with the applicable parameters.
  .get((req, res) => {

    var input = JSON.parse(req.params.id)
    var parametersText = Object.keys(input)
    var parameters = []

    var query = "SELECT * FROM components WHERE "

    var first = false;

    for (var i = 0; i < parametersText.length; i++) {
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
        // If there's an error then provide the error message and the different attributes that could have caused it.
        res.send("ERROR! error message:" + err.message + " Input: " + inputString + ", query: " + query + ", values: " + values + ", valuesText: " + valuesText)
      } else
        res.json(rows)
    })

  })

  //In order to change a component; send in a JSON object with the applicable parameters (componentName and componentVersion or id must be provided).
  //In order to change the approval of a license attached to a component; send in a JSON object 
  //with the applicable parameters (Ether componentName and componentVersion or id aswell as licenseID, approved and/or approvedBy must be provided).
  .post((req, res) => {
    let input = JSON.parse(req.params.id)
    let inputParametersText = Object.keys(input)

    let parametersText = []
    let parameters = []

    let correctInputComponentName = null
    let correctInputComponentVersion = null
    let correctInputId = null
    let approved = [null, null]
    let date = false
    //Make sure that there is a componentName and componentVersion provided or an id provided. Also checks if dateCreated and lastEdited is provided aswell. 
    //Also check if approved or approvedBy was provided.
    for (let i = 0; i < inputParametersText.length; i++) {
      if (inputParametersText[i] == 'componentName') {

        correctInputComponentName = input[inputParametersText[i]]

      } else if (inputParametersText[i] == 'componentVersion') {

        correctInputComponentVersion = input[inputParametersText[i]]

      } else if (inputParametersText[i] == 'id') {

        correctInputId = input[inputParametersText[i]]

      } else if (inputParametersText[i] == 'approved') {

        if (input[inputParametersText[i]] == 0 && approved[1] == null) {
          approved[1] = ''
        }
        approved[0] = input[inputParametersText[i]]

      } else if (inputParametersText[i] == 'approvedBy') {

        if (input[inputParametersText[i]] != '') {
          approved[0] = 1
          approved[1] = input[inputParametersText[i]]
        }

      } else if (inputParametersText[i] == 'lastEdited') {

        parameters.push(input[inputParametersText[i]])
        parametersText.push(inputParametersText[i])
        parameters[i] = new Date().toDateString()
        date = true

      } else if (inputParametersText[i] != 'dateCreated' && inputParametersText[i] != 'licenseID') {

        parameters.push(input[inputParametersText[i]])
        parametersText.push(inputParametersText[i])

      }
    }

    //logic for correct approve/approveBy
    if (approved[0] != null) {
      if (approved == 0 && approved[1] == null) {
        approved[1] = ''
      } else if (approved == 1 && approved[1] == null) {
        approved[0] = null
      }
    }

    //Insert approved and approvedBy if it passed the logic check
    if (approved[0] != null && approved[1] != null) {
      parametersText.push('approved')
      parameters.push(approved[0])
      parametersText.push('approvedBy')
      parameters.push(approved[1])
    }

    //If lastEdited wasn't provided then provide it
    if (!date) {
      parametersText.push('lastEdited')
      parameters.push(new Date().toDateString())
    }

    //Make sure that there is either an id provided or a componentName and componentVersion provided
    if ((correctInputComponentName != null && correctInputComponentVersion != null) || correctInputId != null) {

      let queryCheckApproved = "SELECT * FROM components"
      let parametersCheckApproved = []
      //Check if either componentName/componentVersion or id was provided and use them one find the row to check
      if (correctInputComponentName != null && correctInputComponentVersion != null) {
        queryCheckApproved += " WHERE componentName = ? AND componentVersion = ?;"
        parametersCheckApproved.push(correctInputComponentName)
        parametersCheckApproved.push(correctInputComponentVersion)
      } else if (correctInputId != null) {
        queryCheckApproved += " WHERE id = ?;"
        parametersCheckApproved.push(correctInputId)
      }
      req.db.get(queryCheckApproved, parametersCheckApproved, (error, row) => {
        if (error) {
          console.log(error.message)
          res.status(500)
          res.send("ERROR! error message:" + error.message + ", query: " + queryCheckApproved + ", parameters: " + parametersCheckApproved)
        } else {
          //Make sure that row is not null and that an approved component can't be approved again by a diffrent person
          if (row != null && (approved[0] == null && approved[1] == null) || ((row.approved == 1 && approved[0] == 0) || (row.approved != 1 && approved[1] != ''))) {
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
            if (correctInputComponentName != null && correctInputComponentVersion != null) {
              query += " WHERE componentName = ? AND componentVersion = ?;"
              parameters.push(correctInputComponentName)
              parameters.push(correctInputComponentVersion)
            } else if (correctInputId != null) {
              query += " WHERE id = ?;"
              parameters.push(correctInputId)
            }

            req.db.run(query, parameters, (error) => {
              if (error) {
                console.log(error.message)
                res.status(500)
                res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
              } else {
                res.status(200)
                res.send("Success")
              }
            })
          }//Else throw an error
          else {
            let message
            if (row != null) {
              message = {
                "errorType": "alreadySigned",
                "byUser": "" + row.approvedBy
                //"onTime": "1510062744"
              }
            } else {
              message = {
                "errorType": "componentDoesNotExist"
              }
            }
            console.log(message)
            res.status(500).send(message)
          }
        }
      })
    } else {
      console.log("ERROR! Must insert either a correct id or a correct componentName and a correct componentVerison.")
      res.status(500)
      res.send("ERROR! Must insert either a correct id or a correct componentName and a correct componentVerison.")
    }

  })

  //In order to add a new component; send in a JSON object with the applicable parameters (componentName and componentVersion must be provided).
  //In order to add a new license to the component; send in a JSON object with the applicable parameters (componentName, componentVersion and licenseID must be provided).
  .put((req, res) => {
    let input = JSON.parse(req.params.id)
    let parametersText = Object.keys(input)
    let parameters = []

    let correctInputComponentName = null
    let correctInputComponentVersion = null
    let correctInputLicenseID = null
    let date = [false, false]
    //Make sure that there is a componentName and componentVersion provided. Also checks if dateCreated and lastEdited is provided.
    for (let i = 0; i < parametersText.length; i++) {
      parameters.push(input[parametersText[i]])
      if (parametersText[i] == 'componentName') {
        correctInputComponentName = parameters[i]
      } else if (parametersText[i] == 'componentVersion') {
        correctInputComponentVersion = parameters[i]
      } else if (parametersText[i] == 'licenseID') {
        correctInputLicenseID = parameters[i]
      } else if (parametersText[i] == 'dateCreated') {
        parameters[i] = new Date().toDateString()
        date[0] = true
      } else if (parametersText[i] == 'lastEdited') {
        parameters[i] = new Date().toDateString()
        date[1] = true
      }
    }
    //If dateCreated wasn't provided then provide it
    if (!date[0]) {
      parametersText.push('dateCreated')
      parameters.push(new Date().toDateString())
    }
    //If lastEdited wasn't provided then provide it
    if (!date[1]) {
      parametersText.push('lastEdited')
      parameters.push(new Date().toDateString())
    }

    //Make sure the necessary parameters are provided to insert a new component.
    if (correctInputComponentName != null && correctInputComponentVersion != null && correctInputLicenseID == null) {

      let query = "INSERT INTO components ( "

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
          res.status(500)
          res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
        } else {
          var componentID = 1
          //Get the id of the to be created component.
          var queryGetID = "SELECT MAX(id) AS 'id' FROM components;"
          req.db.get(queryGetID, [], (error, row) => {
            if (error) {
              //If there's an error then provide the error message and the different attributes that could have caused it.
              res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
            } else {
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
            }
          })
        }
      })

    } //Make sure the necessary parameters are provided to insert a new license into the component.
    else if (correctInputComponentName != null && correctInputComponentVersion != null && correctInputLicenseID != null) {

      //Get the id of the component.
      var queryGetID = "SELECT id FROM components WHERE componentName = ? AND componentVersion = ?;"
      req.db.get(queryGetID, [correctInputComponentName, correctInputComponentVersion], (error, row) => {
        if (error) {
          console.log(error.message)
          res.status(500)
          res.send(error.message)
        } else {
          if (row != null) {
            //Insert the license as a license of the component
            let query = "INSERT INTO licensesInComponents ( licenseID, componentID) VALUES (?, ?);"
            parameters = [correctInputLicenseID, row.id]
            req.db.run(query, parameters, (error) => {
              if (error) {
                console.log(error.message)
                res.status(500)
                res.send(error.message)
              } else {
                //Get the license
                let queryGetLicense = "SELECT * FROM licenses WHERE id = ?;"
                req.db.get(queryGetLicense, [correctInputLicenseID], (error, rowLicense) => {
                  if (error) {
                    console.log(error.message)
                    res.status(500)
                    res.send(error.message)
                  } else {
                    //Log the addition of the license
                    var parametersLog = [row.id, new Date().toDateString(), "Added the license: " + rowLicense.licenseName + " v" + rowLicense.licenseVersion + "."]
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
                  }
                })
              }
            })
          } else {
            console.log("ERROR: Cannot add a license to a non existing component.")
            res.status(500)
            res.send("ERROR: Cannot add a license to a non existing component.")
          }
        }
      })

    } else {
      res.status(500)
      res.send("ERROR: componentName or componentVersion wasn't provided.")
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
