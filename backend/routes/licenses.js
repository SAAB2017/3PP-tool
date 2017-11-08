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

    .put((req, res) => {
      res.status(405)
      res.send("Method not allowed")
    })

    .delete((req, res) => {
        res.status(405)
        res.send("Method not allowed")
    })

// ----------------------------------------------------------------------------
//  Methods for /licenses/:id
// ----------------------------------------------------------------------------
router.route('/:id')

    // In order to search; send in a JSON object with the applicable parameters.
    .get((req, res) => {

      let input = JSON.parse(req.params.id)
      let parametersText = Object.keys(input)
      let parameters = []

      let query = "SELECT * FROM licenses WHERE "

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
          // If there's an error then provide the error message and the different attributes that could have caused it.
          res.send("ERROR! error message:" + err.message + " Input: " + inputString + ", query: " + query + ", values: " + values + ", valuesText: " + valuesText)
        } else
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

      let input

      // Simple check for parse errors.
      try {
        input = JSON.parse(req.params.id)
      } catch (e) {
        res.status(500)
        res.send("JSON.parse try/catch statement failed")

        return
      }

      // Check if licenseName and licenseVersion exist within input.
      // If they do not; send an error message and return.
      if (!input.hasOwnProperty("licenseName") || !input.hasOwnProperty("licenseVersion")) {
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
          res.send("ERROR! error message:" + error.message + " Input: " + inputString + ", query: " + queryGetID + ", values: " + values + ", valuesText: " + valuesText)
        } else
          licenseID += row.id
      })

      // Construct SQL query based on input parameters.
      let query = "INSERT INTO licenses ("
      let values = []
      let parametarizedQuery = ""

      for (key in input) {
        query += key + ","
        values.push(input[key])
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

module.exports = router
