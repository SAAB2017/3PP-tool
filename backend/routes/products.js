var express = require('express')
var router = express.Router()

// ----------------------------------------------------------------------------
//  Methods for /products
// ----------------------------------------------------------------------------
router.route('/')

  .get((req, res) => {
    req.db.all("SELECT * FROM products", (err, rows) => {
      res.json(rows)
    })
  })

  .post((req, res) => {
    var product = req.body.product
    var version = req.body.version

    var query = "INSERT INTO products (product, version) VALUES (?, ?)"

    var parameters = [product, version]

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
//  Methods for /products/:id
// ----------------------------------------------------------------------------
router.route('/:id')

  .get((req, res) => {
    var query = "SELECT * FROM products WHERE id = ?"
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
    var query = "DELETE FROM products WHERE id = ?"
    var id = req.params.id

    req.db.get(query, [id], (err, row) => {
      res.status(200)
      res.send("product deleted")
    })
  })

module.exports = router
