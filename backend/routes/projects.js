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

  .post((req, res) => {
    var project = req.body.project
    var version = req.body.version

    var query = "INSERT INTO projects (project, version) VALUES (?, ?)"

    var parameters = [project, version]

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
  .put((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

  // TODO - implement
  .delete((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/pending
// ----------------------------------------------------------------------------
router.route('/pending')

  .get((req, res) => {
    req.db.all("SELECT * FROM projects where approved=0", (err, rows) => {
      res.json(rows)
    })
  })

  .post((req, res) => {
    var project = req.body.project
    var version = req.body.version

    var query = "INSERT INTO projects (project, version) VALUES (?, ?)"

    var parameters = [project, version]

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
  .put((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

  // TODO - implement
  .delete((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/pending/:id
// ----------------------------------------------------------------------------
router.route('/pending/:id')

  .get((req, res) => {
    req.db.get(`SELECT * FROM projects where id=${req.params.id}`, (err, rows) => {
      res.json(rows)
    })
  })

  .post((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

  // TODO - implement
  .put((req, res) => {
    let Q = `UPDATE projects SET approved = 1, approvedBy = '${req.body.approvedBy}' where id = ${req.body.id}`
    console.log(Q)
    req.db.run(Q, error => {
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
  .delete((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

// ----------------------------------------------------------------------------
//  Methods for /projects/:id
// ----------------------------------------------------------------------------
router.route('/:id')

  .get((req, res) => {
    var query = "SELECT * FROM projects WHERE id = ?"
    var id = req.params.id

    req.db.get(query, [id], (err, row) => {
      res.json(row)
    })
  })

  .post((req, res) => {
    res.status(405)
    res.send("Method not allowed")
  })

  // TODO - implement
  .put((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

  .delete((req, res) => {
    var query = "DELETE FROM projects WHERE id = ?"
    var id = req.params.id

    req.db.get(query, [id], (err, row) => {
      res.status(200)
      res.send("project deleted")
    })
  })

module.exports = router
