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
    // Input parameters must be (order does not matter):
    // licenseName, licenseVersion, dateCreated, lastEdited, URL, comment, licenseType
    .put((req, res) => {

        var licenseName = req.body.licenseName
        var licenseVersion = req.body.licenseVersion
        var dateCreated = req.body.dateCreated
        var lastEdited = req.body.lastEdited
        var URL = req.body.URL
        var comment = req.body.comment
        var licenseType = req.body.licenseType

        var query = "INSERT INTO licenses (licenseName, licenseVersion, dateCreated, lastEdited, URL, comment, licenseType) VALUES" +
            "(?, ?, ?, ?, ?, ?, ?)"
        var parameters = [licenseName, licenseVersion, dateCreated, lastEdited, URL, comment, licenseType]

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

    
    .delete((req, res) => {
        res.status(405)
        res.send("Method not allowed")
    })

// ----------------------------------------------------------------------------
//  Methods for /licenses/:id
// ----------------------------------------------------------------------------
router.route('/:id')

    //In order to get a specific license or a specific group of licenses based on search parameters then
    //this method must be called with an identifier constructed as following:
    //Example search identifier: "licenseName=Test License1-licenseType=License type1
    //Between each parameter proveded there must be a '-' other than that, the order of provided
    //parameters makes no difference. 
    .get((req, res) => {

        var query = "SELECT * FROM licenses WHERE "
        var parameters = []
        var values = []
        var valuesText = []

        var inputString = req.params.id.split("-")
        //Get search parameters from input 
        for (var i = 0; i < inputString.length; i++) {
            var tempHolder = inputString[i].split("=")
            valuesText.push(tempHolder[0])
            values.push(tempHolder[1])
        }

        //Construct remaining SQL query based on search parameters
        var first = false
        for (var i = 0; i < valuesText.length; i++) {
            if (values[i] != null) {
                if (!first) {
                    first = true
                    query += "" + valuesText[i] + " = ? "
                } else {
                    query += "AND " + valuesText[i] + " = ? "
                }
                parameters.push(values[i])
            }
        }

        req.db.all(query, parameters, (err, rows) => {
            if (err) {
                //If there's an error then provide the different attributes that could have caused it. 
                res.send("ERROR! Input: " + inputString + ", query: " + query + ", values: " + values + ", valuesText: " + valuesText)
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

module.exports = router
