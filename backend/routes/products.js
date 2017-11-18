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

    let parametersText = []
    let parameters = []
    let correctInputProductName = req.body.productName
    let correctInputProductVersion = req.body.productVersion
    let correctInputId = req.body.id
    let approved = [req.approved, req.approvedBy]

    getUpdateProductParameters(req, parametersText, parameters, approved, function (returnValue) {
      approved = returnValue[0]
      parameters = returnValue[1]
      parametersText = returnValue[2]
    })

    //Make sure that there is either an id provided or a productName and productVersion provided
    if ((correctInputProductName != null && correctInputProductVersion != null) || correctInputId != null) {

      //Get the product if it exists
      getProduct(req, res, correctInputProductName, correctInputProductVersion, correctInputId, function (product) {

        //Make sure that row is not null and that an approved component can't be approved again by a diffrent person
        if (product != null && ((approved[0] == null && approved[1] == null) || ((product.approved == 1 && approved[0] == 0) || (product.approved != 1 && approved[1] != '')))) {

          //update the product
          updateProduct(req, res, correctInputProductName, correctInputProductVersion, correctInputId, parametersText, parameters, function (update) {
            //get product
            getProduct(req, res, correctInputProductName, correctInputProductVersion, correctInputId, function(product){
              insertUpdateIntoLog(req, res, product.id, approved)
            })
          })

        }//Else throw an error
        else {
          let message
          if (product != null) {
            message = {
              "errorType": "alreadySigned",
              "byUser": "" + product.approvedBy
              //"onTime": "1510062744"
            }
          } else {
            message = {
              "errorType": "productDoesNotExist"
            }
          }
          console.log(message)
          res.status(500).send(message)
        }
      })
    } else {
      console.log("ERROR! Must insert either a correct id or a correct componentName and a correct componentVerison.")
      res.status(500)
      res.send("ERROR! Must insert either a correct id or a correct componentName and a correct componentVerison.")
    }
  })

  // TODO - implement
  .put((req, res) => {
    let parametersText = []
    let parameters = []

    let correctInputProductName = req.body.productName
    let correctInputProductVersion = req.body.productVersion
    let correctInputComponentID = req.body.componentID
    let correctInputId = req.body.id

    //Get the correct parameters
    getInsertProductParameters(req, parametersText, parameters, function (returnValue) {
      parametersText = returnValue[0]
      parameters = returnValue[1]
    })

    //Make sure the necessary parameters are provided to insert a new product.
    if (correctInputProductName != null && correctInputProductVersion != null && correctInputComponentID == null) {

      //insert the new product
      insertNewProduct(req, res, parametersText, parameters, function(returnValue){
        //Get the product so that the id can be extracted
        getProduct(req, res, correctInputProductName, correctInputProductVersion, null, function (product) {
          insertProductLog(req, res, product.id, "Product created.",
          function (returnValue) {
            res.status(201)
            res.send("Success!")
          })
        })
      })

    } //Make sure the necessary parameters are provided to insert a new license into the product.
    else if ((correctInputProductName != null && correctInputProductVersion != null) || correctInputId != null && correctInputComponentID != null) {

      //Get the product so that the id can be extracted
      getProduct(req, res, correctInputProductName, correctInputProductVersion, correctInputId, function (product) {
        if (product == null) {
          message = {
            "errorType": "componentDoesNotExist"
          }
          console.log(message)
          res.status(500).send(message)
        } else {

          //Insert the provided component into the product
          insertComponentIntoProduct(req, res, correctInputComponentID, product.id, function (returnValue) {
            //Get the component that was inserted
            getComponent(req, res, null, null, correctInputComponentID, function (component) {
              if (component == null) {
                message = {
                  "errorType": "componentDoesNotExist"
                }
                console.log(message)
                res.status(500).send(message)
              } else {
                //Create a log of the component added to the product
                insertProductLog(req, res, product.id, "Added component: " + component.componentName + " v" + component.componentVersion + ".",
                  function (returnValue) {
                    updateProduct(req, res, null, null, product.id, ['approved', 'approvedBy'], ['0', '']);
                  })
              }
            })
          })
        }
      })
    } else {
      res.status(500)
      res.send("ERROR: productName or productVersion or id wasn't provided.")
    }
  })

  // TODO - implement
  .delete((req, res) => {
    res.status(501)
    res.send("Method not implemented")
  })

  // ----------------------------------------------------------------------------
//  Methods for /products/approve
// ----------------------------------------------------------------------------

function validateRequest(product, approved) {
  return ((approved[0] == null && approved[1] == null) || ((product.approved == 1 && approved[0] == 0) || (product.approved != 1 && approved[1] != '')))
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
    // precondition: check that id == OK, signature == OK and that the product hasn't yet been signed
    const input = req.body
    let approved = getCorrectApproved(input)

    //Get product to make sure that it is not approved already
    getProduct(req, res, null, null, input.id, function (product) {
      //Make sure that row is not null and that an approved product can't be approved again by a diffrent person
      if (product != null && input.id != null && validateRequest(product, approved)) {

        //update the product
        updateProduct(req, res, null, null, input.id, ['approved', 'approvedBy'], approved, function () {
          insertUpdateIntoLog(req, res, product.id, approved)
        })

      }//Else throw an error
      else {
        let message
        message = {
          "errorType": "alreadySigned",
          "byUser": "" + product.approvedBy
          //"onTime": "1510062744"
        }
        console.log(message)
        res.status(500).send(message)
      }
    })
    // postcondition: product approved, signed and logged
  })

// ----------------------------------------------------------------------------
//  Methods for /products/add
// ----------------------------------------------------------------------------
router.route('/add')
  .post((req, res) => {
    // precondition: product doesn't already exist.
    const input = req.body
    parametersText = []
    parameters = []

    //Get the correct parameters
    getInsertProductParameters(req, parametersText, parameters, function (returnValue) {
      parametersText = returnValue[0]
      parameters = returnValue[1]

      //Make sure the necessary parameters are provided to insert a new product.
      if (input.productName != null && input.productVersion != null) {

        insertNewProduct(req, res, parametersText, parameters, function (returnValue) {
          //Get the product so that the id can be extracted
          getProduct(req, res, input.productName, input.productVersion, null, function (product) {
            insertProductLog(req, res, product.id, "Product created.",
              function (returnValue) {
                res.status(201).send("Success!")
              })
          })
        })

      }
    })
    // postcondition: product created and logged.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/connectComponentWithProduct
// ----------------------------------------------------------------------------
router.route('/connectComponentWithProduct')
  .post((req, res) => {
    // precondition: Component must exist aswell as the product.
    const input = req.body

    if (input.productID != null && input.componentID != null) {
      //Insert the provided license into the component
      insertComponentIntoProduct(req, res, input.componentID, input.productID, function (returnValue) {
        //Get the component that was inserted
        getComponent(req, res, null, null, input.componentID, function (component) {
          if (component == null) {
            message = {
              "errorType": "componentDoesNotExist"
            }
            console.log(message)
            res.status(500).send(message)
          } else {
            //Create a log of the license added to the component
            insertProductLog(req, res, input.productID, "Added component: " + component.componentName + " v" + component.componentVersion + ".",
              function (returnValue) {
                updateProduct(req, res, null, null, input.productID, ['approved', 'approvedBy'], ['0', ''], function (returnValue) {
                  res.status(200).send("Success")
                });
              })
          }
        })
      })
    }
    // postcondition: The component is connected with the product.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/productsInProject/:id
// ----------------------------------------------------------------------------
router.route('/productsInProject/:id')
  .get((req, res) => {
    // precondition: project exists and it has products connected to it.
    let input = JSON.parse(req.params.id)

    if (input.id != null) {
      //Get products from the project
      getproductsFromProject(req, res, input.id)
    }
    // postcondition: components connected to the product.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/productsWithLicense/:id
// ----------------------------------------------------------------------------
router.route('/productsWithLicense/:id')
  .get((req, res) => {
    // precondition: license exists and it has atleast one component connected to it.
    let input = JSON.parse(req.params.id)

    if (input.id != null) {
      //Get products connected to the license
      getProductsWithLicense(req, res, input.id)
    }
    // postcondition: products with the license connected to it.
  })

// ----------------------------------------------------------------------------
//  Methods for /products/productsWithComponent/:id
// ----------------------------------------------------------------------------
router.route('/productsWithComponent/:id')
.get((req, res) => {
  // precondition: component exists and is connected with atleast one product.
  let input = JSON.parse(req.params.id)

  if (input.id != null) {
    //Get products connected to the component
    getProductsWithComponent(req, res, input.id)
  }
  // postcondition: products with the components connected to it.
})

// ----------------------------------------------------------------------------
//  Methods for /products/log/:id
// ----------------------------------------------------------------------------
router.route('/log/:id')
.get((req, res) => {
  // precondition: component exists.
  let input = JSON.parse(req.params.id)
  let parametersText = Object.keys(input)
  let parameters = []

  if (input.id != null) {
    //Get the component log
    getComponentLog(req, res, input.id)
  }
  // postcondition: the log entries of the component
})

// ----------------------------------------------------------------------------
//  Methods for /products/:id
// ----------------------------------------------------------------------------
router.route('/:id')

  .get((req, res) => {
    let input = req.params.id
    const query = `SELECT * FROM products WHERE id=${input}`
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

//Get component from parameters
function getProductFromParameters(req, res, input, parametersText, parameters) {
  let query = "SELECT * FROM products WHERE "

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
      res.send("ERROR! error message:" + err.message + ", query: " + query + ", parameters: " + parameters)
    } else
      res.json(rows)
  })
}

//Get parameters
function getInsertProductParameters(req, parametersText, parameters, callback) {
  let date = [false, false]

  //Check if productName was provided
  if (req.body.hasOwnProperty('productName')) {
    parameters.push(req.body.productName)
    parametersText.push('productName')
  }
  //Check if productVersion was provided
  if (req.body.hasOwnProperty('productVersion')) {
    parameters.push(req.body.productVersion)
    parametersText.push('productVersion')
  }
  //Check if dateCreated was provided
  if (req.body.hasOwnProperty('dateCreated')) {
    parameters.push(new Date().toDateString())
    parametersText.push('dateCreated')
    date[0] = true
  }
  //Check if lastEdited was provided
  if (req.body.hasOwnProperty('lastEdited')) {
    parameters.push(new Date().toDateString())
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
    parameters.push(new Date().toDateString())
  }
  //If lastEdited wasn't provided then provide it
  if (!date[1]) {
    parametersText.push('lastEdited')
    parameters.push(new Date().toDateString())
  }
  let obj = [parametersText, parameters]
  callback(obj);
}

//Insert product
function insertNewProduct(req, res, parametersText, parameters, callback) {
  let query = "INSERT INTO products ( "

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
      callback(true)
    }
  })
}

//Get product
function getProduct(req, res, productName, productVersion, id, callback) {
  let query = "SELECT * FROM products"
  let parameters = []
  if (productName != null && productVersion != null) {
    query += " WHERE productName = ? AND productVersion = ?;"
    parameters.push(productName)
    parameters.push(productVersion)
  } else if (id != null) {
    query += " WHERE id = ?;"
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
    } else {
      if (row != null) {
        callback(row);
      } else callback(null);
    }
  })
}

//Get Component
function getComponent(req, res, componentName, componentVersion, id, callback) {
  let query = "SELECT * FROM components"
  let parameters = []
  if (componentName != null && componentVersion != null) {
    query += " WHERE componentName = ? AND componentVersion = ?;"
    parameters.push(componentName)
    parameters.push(componentVersion)
  } else if (id != null) {
    query += " WHERE id = ?;"
    parameters.push(id)
  }

  req.db.get(query, parameters, (error, row) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
    } else {
      if (row != null) {
        callback(row);
      } else callback(null);
    }
  })
}

//Insert a new row into productLog
function insertProductLog(req, res, id, text, callback) {
  let parametersLog = [id, new Date().toDateString(), text]
  let queryLog = "INSERT INTO productLog (productID, dateLogged, note) VALUES (?, ?, ?);"
  req.db.run((queryLog), parametersLog, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send(error.message)
    } else {
      callback(true);
    }
  })
}

//Update the product
function updateProduct(req, res, productName, productVersion, id, parametersText, parameters, callback) {
  let query = "UPDATE products SET "

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

  //Check if either productName/productVersion or id was provided and use them one find the row to alter
  if (productName != null && productVersion != null) {
    query += " WHERE productName = ? AND productVersion = ?;"
    parameters.push(productName)
    parameters.push(productVersion)
  } else if (id != null) {
    query += " WHERE id = ?;"
    parameters.push(id)
  }

  req.db.run(query, parameters, (error) => {
    if (error) {
      console.log(error.message)
      res.status(500)
      res.send("ERROR! error message:" + error.message + ", query: " + query + ", parameters: " + parameters)
    } else {
      callback(true)
    }
  })
}

//insert a component into a product
function insertComponentIntoProduct(req, res, componentID, productID, callback) {
  //Insert the component as a component of the component
  let query = "INSERT INTO componentsInProducts ( componentID, productID) VALUES (?, ?);"
  let parameters = [componentID, productID]
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

//Get parameters
function getUpdateProductParameters(req, parametersText, parameters, approved, callback) {
  let date = false

  if (req.body.hasOwnProperty('approved')) {

    if (req.body.approved == 0 && approved[1] == null) {
      approved[1] = ''
    }
    approved[0] = req.body.approved

  }

  if (req.body.hasOwnProperty('approvedBy')) {

    if (req.body.approvedBy != '') {
      approved[0] = 1
      approved[1] = req.body.approvedBy
    }

  }

  if (req.body.hasOwnProperty('lastEdited')) {

    parameters.push(new Date().toDateString())
    parametersText.push('lastEdited')
    date = true
  }

  if (req.body.hasOwnProperty('comment')) {

    parameters.push(req.body.comment)
    parametersText.push('comment')

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
  let obj = [approved, parameters, parametersText]
  callback(obj);
}

//Insert the update into the ProductLog
function insertUpdateIntoLog(req, res, correctInputId, approved){
  //If approve has changed then log it
  if(req.body.hasOwnProperty('approved')){
    if(approved[0] == 0){
      insertProductLog(req, res, correctInputId, "Product changed to not approved.", function (log) {
      })
    }else if(approved[0] == 1){
      insertProductLog(req, res, correctInputId, "Product changed to approved by " + approved[1] + ".", function (log) {
      })
    }
  }//If approveBy has changed then log it
  else if(req.body.hasOwnProperty('approvedBy')){
    if(approved[1] == ''){
      insertProductLog(req, res, correctInputId, "Product changed to not approved.", function (log) {
      })
    }else if(approved[1] != ''){
      insertProductLog(req, res, correctInputId, "Product changed to approved by " + approved[1] + ".", function (log) {
      })
    }
  }
  res.status(201)
  res.send("Success!")
}

//Get products in project
function getproductsFromProject(req, res, id) {
  let query = "SELECT productID AS id, productName, productVersion, dateCreated, lastEdited, comment, approved, approvedBy FROM products LEFT OUTER JOIN productsInProjects ON products.id=productsInProjects.productID"

  query += " WHERE projectID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else
      res.send(rows)
  })
}

//Get products connected to license
function getProductsWithLicense(req, res, id) {
  let query = "SELECT DISTINCT productID AS id, productName, productVersion, dateCreated, lastEdited, comment FROM products LEFT OUTER JOIN componentsInProducts ON products.id=componentsInProducts.productID"
              + " LEFT OUTER JOIN licensesInComponents ON licensesInComponents.componentID=componentsInProducts.componentID"

  query += " WHERE licenseID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else
      res.send(rows)
  })
}

//Get products connected to component
function getProductsWithComponent(req, res, id) {
  let query = "SELECT DISTINCT productID AS id, productName, productVersion, dateCreated, lastEdited, comment FROM products LEFT OUTER JOIN componentsInProducts ON products.id=componentsInProducts.productID"

  query += " WHERE componentID = ?;"


  req.db.all(query, [id], (err, rows) => {
    if (err) {
      // If there's an error then provide the error message and the different attributes that could have caused it.
      res.send("ERROR! error message:" + err.message + ", query: " + query)
    } else
      res.send(rows)
  })
}
