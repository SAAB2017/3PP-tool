var express = require('express')
var sqlite3 = require('sqlite3').verbose()
var bodyParser = require('body-parser')
var cors = require('cors')

var db = new sqlite3.Database('backend/sqlite.db')

var components = require('./routes/components')
var products = require('./routes/products')
var projects = require('./routes/projects')
var licenses = require('./routes/licenses')

var api = express()

api.use(cors());
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))
api.use((req, res, next) => {
  req.db = db;
  next()
})

api.use('/components', components)
api.use('/products', products)
api.use('/projects', projects)
api.use('/licenses', licenses)

api.listen(3000)

console.log("Backend running at http://localhost:3000/")
