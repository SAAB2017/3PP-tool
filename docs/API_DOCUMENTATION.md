##### Table of Contents
[Licenses](#licenses)

[](#showAllLicenses)

[Search for a specific license](#searchLicense)

[Get all licenses](#getAllLicenses)

[Show all licenses in a component](#getTheLicensesOfProduct)

[Get the license's log](#showALicenseLog)

[Get the licenses associated with a project](#getTheLicensesOfProject)

[Gets a specific license from its id](#getLicenseById)

[Add a new license](#addLicense)

[Change a license's comment](#changeLicenseComment)

[Change a license's URL](#changeLicenseURL)

[Search for a license based on its name](#getLicenseByName)

[Get licenses in component](#getLicensesInComponent)


[Components](#components)

[Search for a specific signed component](#getSignedComponent)

[Search for a specific unsigned product](#getUnsignedComponent)

[Show all approved components](#getApprovedComponents)

[Approve a component](#approveComponent)

[Add a component](#addComponent)

[Show all pending components](#showAllPendingComponent)

[Show all components in product](#showAllComponentInProduct)

[Connect a license with a component](#connectLicenesWithComponent)

[Show all components connected to a certain project](#showAllComponentsInProject)

[Show all components containing a certain license](#showComponentsWithLicense)

[Show the log for a certain component](#showLogByComponent)

[Change the comment of a certain component](#changeCommentForComponent)

[Get the component with a certain ID](#getComponentByID)


[Products](#products)

[Show all products](#showAllProducts)

[Search for a specific signed product](#getSignedProductById)

[Search for a specific unsigned product](#getUnsignedProductById)

[Show all approved products](#getApprovedProducts)

[Approve a product](#approveProduct)

[Add a product](#addProduct)

[Show all pending products](#getPendingProducts)

[Show all products containing a certain component](#getProductsByComponentId)

[Connect a component with a product](#connectComponentWithProduct)

[Show all products connected to a certain project](#getProductsConnectedWithProject)

[Show all products containing a certain license](#getProductsByLicenseId)

[Show the log for a certain product](#showProductLogById)

[Change the comment of a certain product](#changeCommentOfProduct)

[Get the product with a certain ID](#getProductById)

[Get the product with a certain name](#getProductByName)


[Projects](#projects)

[Show all signed projects](#signedProjects)
 
[Show all unsigned projects](#unsignedProjects)

[Approve a project](#approveProject)

[Add a project](#addProject)

[Show all pending projects](#showPendingProjects)

[Show all projects containing a certain component](#showProjectsConnectedWithComponent)

[Connect a product with a project](#connectProductWithProject)

[Show all projects containing a certain license](#showProjectsWithLicense)

[Show all projects containing a certain product](#showProjectsWithProduct)

[Show the log for a certain project](#showLogByProjectId)

[Change the comment of a certain project](#changeCommentOfProject)

[Get the project with a certain ID](#getProjectById)

[Search for a specific signed project](#getSignedProjectByName)

[Search for a specific unsigned project](#getUnsignedProjectByName)

---
Title: API documentation
Version: 0.1.0
---
# API documentation

### Alla API-förfrågningar påbörjas med

<pre class="base">
http://localhost:3000
</pre>

### Länk
I det här dokumentet förutsätter vi att varje anrop påbörjas med ovannämnda länk.

### Format
Alla anrop returneras som **JSON**.

### Statuskod

- **200** Lyckad GET och PUT.
- **201** Lyckad POST.
- **202** Lyckad Provision queued.
- **204** Lyckad DELETE.
- **401** Oautentiserad.
- **409** Misslyckad POST, PUT eller DELETE (Kommer returnera ett error-objekt)

<a name="licenses"/>

# Licenses

<a name="searchForALicense"/>

## Search for a specific license.

### URL

/licenses/search/:id?offset=0&amount=30&sort=licenseName&order=asc

### Method

GET

### URL Params

Required:
```
id = licenseName
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{  "id":5,
              "licenseName":"Apache License",
              "licenseVersion":"2.0",
              "dateCreated":"2017-10-20",
              "lastEdited":"2017-10-15",
              "URL":"https://www.mozilla.org/en-US/MPL/2.0/",
              "comment":null,
              "licenseType":"Open source license"}],
   "links":{  "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
   "sort":{   "column":"&sort=licenseName",
              "order":"&order=asc"},
   "meta":{   "current":0,
              "count":0},
   "errors":{ "message":[],
              "status":"OK"},
   "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/licenses/search/Apache?offset=0&amount=30&sort=licenseName&order=asc')
  .then(response => {
  response.data
}
```

<a name="getAllLicenses"/>

## Get all licenses.

### URL

/licenses/?offset=0&amount=30&sort=licenseName&order=asc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{  "id":5,
              "licenseName":"Apache License",
              "licenseVersion":"2.0",
              "dateCreated":"2017-10-20",
              "lastEdited":"2017-10-15",
              "URL":"https://www.mozilla.org/en-US/MPL/2.0/",
              "comment":null,
              "licenseType":"Open source license"}],
   "links":{  "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
   "sort":{   "column":"&sort=licenseName",
              "order":"&order=asc"},
   "meta":{   "current":0,
              "count":0},
   "errors":{ "message":[],
              "status":"OK"},
   "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/licenses/?offset=0&amount=30&sort=licenseName&order=asc')
  .then(response => {
  response.data
}
```
<a name="showAllLicenses"/>

## Show all licenses in a component.

### URL

/licenses/licensesInComponent/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"licenseName" : "GNU AGPL",
"licenseVersion" : "3.0",
"dateCreated" : "2017-10-01",
"lastEdited" : "2017-10-01",
"URL" : "https://www.gnu.org/licenses/agpl-3.0.en.html",
"comment" : "GNU Affero General Public License",
"licenseType" : "Open source license"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/licenses/licensesInComponent/1')
  .then(response => {
  response.data
}
```
<a name="showALicenseLog"/>

## Get the license's log.

### URL

/licenses/log/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"licenseID" : 1,
"dateLogged" : 0,
"note" : "License created."
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/licenses/log/1')
  .then(response => {
  response.data
}
```

<a name="getTheLicensesOfProduct"/>

## Get the licenses associated with a product.

### URL

/licenses/licensesInProduct/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 9,
"licenseName" : "BSD 3-clause",
"licenseVersion" : "1.0",
"dateCreated" : "2017-11-01",
"lastEdited" : "2017-11-01",
"comment" : null
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/licenses/licensesInProduct/1')
  .then(response => {
  response.data
}
```

<a name="getTheLicensesOfProject"/>

## Get the licenses associated with a project.

### URL

/licenses/licensesInProject/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 9,
"licenseName" : "BSD 3-clause",
"licenseVersion" : "1.0",
"dateCreated" : "2017-11-01",
"lastEdited" : "2017-11-01",
"comment" : null
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/licenses/licensesInProject/1')
  .then(response => {
  response.data
}
```

<a name="getLicenseById"/>

## Gets a specific license from its id.

### URL

/licenses/license/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
{
"id" : 1,
"licenseName" : "GNU AGPL",
"licenseVersion" : "3.0",
"dateCreated" : "2017-10-01",
"lastEdited" : "2017-10-01",
"URL" : "https://www.gnu.org/licenses/agpl-3.0.en.html",
"comment" : "GNU Affero General Public License",
"licenseType" : "Open source license"
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/licenses/license/1')
  .then(response => {
  response.data
}
```

<a name="addLicense"/>

## Add a new license.

### URL

/licenses/add

### Method

POST

### Data Params

Example:
```
{
  "licenseName" : String,
  "licenseVersion" : String,
  "dateCreated" : String,
  "lastEdited" : String,
  "URL" : String,
  "comment" : String,
  "licenseType" : String
}
```

### Success Response

Code: 201

Content:
```
{
  "send": "success"
}
```

### Error Response

Code: 500

Content:
```
{
  error_id : "E04"
}
```

### Sample Call
```
let data = '{
              "licenseName" : "New License",
              "licenseVersion" : "1.0",
              "dateCreated" : "2017-12-05",
              "lastEdited" : "2017-12-05",
              "URL" : "http://www.example.com",
              "comment" : "This is a comment.",
              "licenseType" : "Type of license."
}'
```
```javascript
axios.post('/licenses/add', data)
  .then(response => {
  response
})
```

<a name="changeLicenseComment"/>

## Change a license's comment.

### URL

/licenses/comment

### Method

POST

### Data Params

Example:
```
{
  "id" : Integer,
  "comment" : String
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
```
{
  error_id : "E04"
}
```

### Sample Call
```
let data = '{
              "id" : 1,
              "comment" : "This is a comment."
}'
```
```javascript
axios.post('/licenses/comment', data)
  .then(response => {
  response
})
```

<a name="changeLicenseURL"/>

## Change a license's URL.

### URL

/licenses/URL

### Method

POST

### Data Params

Example:
```
{
  "id" : Integer,
  "URL" : String
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
```
{
  error_id : "E04"
}
```

### Sample Call
```
let data = '{
              "id" : 1,
              "URL" : "This is an URL."
}'
```
```javascript
axios.post('/licenses/URL', data)
  .then(response => {
  response
})
```

<a name="getLicenseByName"/>

## Search for a license based on its name.

### URL

/licenses/search/:params

### Method

GET

### URL Params

Required:
```
params = String
```
Example: params = GNU AGPL

### Success Response

Code: 200

Content:
```
{
"id" : 1,
"licenseName" : "GNU AGPL",
"licenseVersion" : "3.0",
"dateCreated" : "2017-10-01",
"lastEdited" : "2017-10-01",
"URL" : "https://www.gnu.org/licenses/agpl-3.0.en.html",
"comment" : "GNU Affero General Public License",
"licenseType" : "Open source license"
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/licenses/search/GNU AGPL')
  .then(response => {
  response.data
}
```

<a name="getLicensesInComponent"/>

## Get licenses in component.

### URL

/licenses/licensesInComponent/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```

### Success Response

Code: 200

Content:
```
{
  "items":[{  "id":5,
              "licenseName":"Apache License",
              "licenseVersion":"2.0",
              "dateCreated":"2017-10-20",
              "lastEdited":"2017-10-15",
              "URL":"https://www.mozilla.org/en-US/MPL/2.0/",
              "comment":null,
              "licenseType":"Open source license"}],
   "links":{  "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
   "sort":{   "column":"&sort=licenseName",
              "order":"&order=asc"},
   "meta":{   "current":0,
              "count":0},
   "errors":{ "message":[],
              "status":"OK"},
   "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/licenses/licensesInComponent/1')
  .then(response => {
  response.data
}
```

<a name="components"/>

# Components

<a name="getSignedComponent"/>

## Search for a specific signed component.

### URL

/components/search/:id?offset=0&amount=30&sort=componentName&order=asc

### Method

GET

### URL Params

Required:
```
id = componentName
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{  "id":3,
              "componentName":"axios",
              "componentVersion":"0.17.0",
              "dateCreated":"2017-11-04",
              "lastEdited":"2017-11-04",
              "comment":"Promise based HTTP client for the browser and node.js.",
              "approved":1,
              "approvedBy":"Nils Nilsson"}],
  "links":{   "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
  "sort":{    "column":"&sort=componentName",
              "order":"&order=asc"},
  "meta":{    "current":0,
              "count":0},
  "errors":{  "message":[],
              "status":"OK"},
  "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/components/search/axios?offset=0&amount=30&sort=componentName&order=asc')
  .then(response => {
  response.data
}
```

<a name="getUnsignedComponent"/>

## Search for a specific unsigned product.

### URL

/components/pending/search/:id?offset=0&amount=30&sort=componentName&order=asc

### Method

GET

### URL Params

Required:
```
id = productName
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{  "id":10,
              "componentName":"sqlite3",
              "componentVersion":"3.1.13",
              "dateCreated":"2017-11-11",
              "lastEdited":"2017-11-11",
              "comment":"Asynchronous, non-blocking SQLite3 bindings for Node.js.",
              "approved":0,
              "approvedBy":"Nils Nilsson"}],
  "links":{   "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
  "sort":{    "column":"&sort=componentName",
              "order":"&order=asc"},
  "meta":{    "current":0,
              "count":0},
  "errors":{  "message":[],
              "status":"OK"},
  "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/components/pending/search/sqlite3?offset=0&amount=30&sort=componentName&order=asc')
  .then(response => {
  response.data
}
```

<a name="getApprovedComponents"/>

## Show all approved components

### URL

/components/?offset=0&amount=30&sort=componentName&order=asc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{  "id":3,
              "componentName":"axios",
              "componentVersion":"0.17.0",
              "dateCreated":"2017-11-04",
              "lastEdited":"2017-11-04",
              "comment":"Promise based HTTP client for the browser and node.js.",
              "approved":1,
              "approvedBy":"Nils Nilsson"}],
  "links":{   "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
  "sort":{    "column":"&sort=componentName",
              "order":"&order=asc"},
  "meta":{    "current":0,
              "count":0},
  "errors":{  "message":[],
              "status":"OK"},
  "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/components/?offset=0&amount=30&sort=componentName&order=asc')
  .then(response => {
  response.data
}
```

<a name="approveComponent"/>

## Approve a component.

### URL

/components/approve

### Method

PUT

### Data Params

Example:
```
{
  id : Integer,
  approved : Integer,
  approvedBy : String,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              id : 1,
              approved : 1,
              approvedBy : "Nils Nilsson",
            }'
```
```javascript
axios.post('/components/approve', data)
  .then(response => {
  response
})
```

<a name="addComponent"/>

## Add a component.

### URL

/components/add

### Method

POST

### Data Params

Example:
```
{
    "componentName" : String,
    "componentVersion" : String,
    "comment" : String,
    "license" : Integer
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
    "componentName":"Random component name",
    "componentVersion":"1.0",
    "comment":"Third party handler Rest API for handling licenses.",
    "license":1
}'
```
```javascript
axios.post('/components/add', data)
  .then(response => {
  response
})
```

<a name="showAllPendingComponent"/>

## Show all pending components.

### URL

/components/pending?offset=0&amount=30&sort=componentName&order=desc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{  "id":3,
              "componentName":"axios",
              "componentVersion":"0.17.0",
              "dateCreated":"2017-11-04",
              "lastEdited":"2017-11-04",
              "comment":"Promise based HTTP client for the browser and node.js.",
              "approved":0,
              "approvedBy":"Nils Nilsson"}],
  "links":{   "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
  "sort":{    "column":"&sort=componentName",
              "order":"&order=asc"},
  "meta":{    "current":0,
              "count":0},
  "errors":{  "message":[],
              "status":"OK"},
  "errorflag":false
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/components/pending?offset=0&amount=30&sort=componentName&order=desc')
  .then(response => {
  response.data
}
```

<a name="showAllComponentInProduct"/>

## Show all components in product.

### URL

/components/componentsInProduct/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"componentName" : "A component",
"componentVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a component.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/components/componentsInProduct/1')
  .then(response => {
  response.data
}
```

<a name="connectLicenesWithComponent"/>

## Connect a license with a component.

### URL

/components/connectLicenseWithComponent

### Method

POST

### Data Params

Example:
```
{
    componentID : Integer,
    licenseID : Integer,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              componentID : 1,
              licenseID : 2,
            '
```
```javascript
axios.post('/components/connectLicenseWithComponent', data)
  .then(response => {
  response
})
```

<a name="showAllComponentsInProject"/>

## Show all components connected to a certain project.

### URL

/components/componentsInProject/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"componentName" : "A component",
"componentVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a component.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/components/componentsInProject/1')
  .then(response => {
  response.data
}
```

<a name="showComponentsWithLicense"/>

## Show all components containing a certain license.

### URL

/components/componentsWithLicense/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"componentName" : "A component",
"componentVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a component.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/components/componentsWithLicense/1')
  .then(response => {
  response.data
}
```

<a name="showLogByComponent"/>

## Show the log for a certain component.

### URL

/components/log/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"componentID" : 1,
"dateLogged" : "2017-11-05",
"note" : "Component created."
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/components/log/1')
  .then(response => {
  response.data
}
```

<a name="changeCommentForComponent"/>

## Change the comment of a certain component.

### URL

/component/comment

### Method

POST

### Data Params

Example:
```
{
    componentID : Integer,
    comment : String,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              componentID : 1,
              comment : "Detta är en ny kommentar",
            '
```
```javascript
axios.post('/components/comment', data)
  .then(response => {
  response
})
```

<a name="getComponentByID"/>

## Get the component with a certain ID.

### URL

/components/component/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
{
  "id":1,
  "componentName":"vue",
  "componentVersion":"2.5.2",
  "dateCreated":"2017-11-01",
  "lastEdited":"2017-11-01",
  "comment":"The Progressive JavaScript Framework.",
  "approved":1,
  "approvedBy":"Nils Nilsson"
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/components/component/1')
  .then(response => {
  response.data
}
```

<a name="products"/>

# Products

<a name="showAllProducts"/>

## Show all products

### URL

/products/all/?offset=0&amount=30&sort=productName&order=asc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
"items": [{  "id":1,
              "productName":"Third-Party License Management REST API",
              "productVersion":"1.0",
              "dateCreated":"2017-11-20",
              "lastEdited":"2017-11-20",
              "comment":"Third party handler Rest API for handling licenses.",
              "approved":1,
              "approvedBy":"Nils Nilsson"},
           {  "id":2,
              "productName":"Third-Party License Management WUI",
              "productVersion":"1.0",
              "dateCreated":"2017-11-20",
              "lastEdited":"2017-11-20",
              "comment":"Third party handler Rest API for handling licenses.",
              "approved":0,
              "approvedBy":"Nils Nilsson"}],
"links": {    "prev":"?offset=0&amount=5&sort=productName&order=asc",
              "current":"?offset=0&amount=5&sort=productName&order=asc",
              "next":"?offset=0&amount=5&sort=productName&order=asc"},
"sort": {     "column":"&sort=productName",
              "order":"&order=asc"},
"meta": {     "current":0,
              "count":0},
"errors": {   "message":[],
              "status":"OK"},
"errorflag": false
}
```

### Sample Call
```javascript
axios.get('/products/all/?offset=0&amount=30&sort=productName&order=asc')
  .then(response => {
  response.data
}
```

<a name="getSignedProductById"/>

## Search for a specific signed product.

### URL

/products/search/:id/?offset=0&amount=30&sort=productName&order=asc

### Method

GET

### URL Params

Required:
```
id = productName
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
"items": [{  "id":1,
              "productName":"Third-Party License Management REST API",
              "productVersion":"1.0",
              "dateCreated":"2017-11-20",
              "lastEdited":"2017-11-20",
              "comment":"Third party handler Rest API for handling licenses.",
              "approved":1,
              "approvedBy":"Nils Nilsson"}],
"links": {    "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
"sort": {     "column":"&sort=productName",
              "order":"&order=asc"},
"meta": {     "current":0,
              "count":0},
"errors": {   "message":[],
              "status":"OK"},
"errorflag": false
}
```

### Sample Call
```javascript
axios.get('/products/search/Third-Party License Management REST API/?offset=0&amount=30&sort=productName&order=asc')
  .then(response => {
  response.data
}
```

<a name="getUnsignedProductById"/>

## Search for a specific unsigned product.

### URL

/products/pending/search/:id/?offset=0&amount=30&sort=productName&order=asc

### Method

GET

### URL Params

Required:
```
id = productName
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
"items": [{  "id":2,
              "productName":"Third-Party License Management WUI",
              "productVersion":"1.0",
              "dateCreated":"2017-11-20",
              "lastEdited":"2017-11-20",
              "comment":"Third party handler Rest API for handling licenses.",
              "approved":0,
              "approvedBy":"Nils Nilsson"}],
"links": {    "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
"sort": {     "column":"&sort=productName",
              "order":"&order=asc"},
"meta": {     "current":0,
              "count":0},
"errors": {   "message":[],
              "status":"OK"},
"errorflag": false
}
```

### Sample Call
```javascript
axios.get('/products/pending/search/Third-Party License Management WUI/?offset=0&amount=30&sort=productName&order=asc')
  .then(response => {
  response.data
}
```

<a name="getApprovedProducts"/>

## Show all approved products

### URL

/products/?offset=0&amount=30&sort=productName&order=asc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
"items": [{  "id":1,
              "productName":"Third-Party License Management REST API",
              "productVersion":"1.0",
              "dateCreated":"2017-11-20",
              "lastEdited":"2017-11-20",
              "comment":"Third party handler Rest API for handling licenses.",
              "approved":1,
              "approvedBy":"Nils Nilsson"}],
"links": {    "prev":"?offset=0&amount=5&sort=productName&order=asc",
              "current":"?offset=0&amount=5&sort=productName&order=asc",
              "next":"?offset=0&amount=5&sort=productName&order=asc"},
"sort": {     "column":"&sort=productName",
              "order":"&order=asc"},
"meta": {     "current":0,
              "count":0},
"errors": {   "message":[],
              "status":"OK"},
"errorflag": false
}
```

### Sample Call
```javascript
axios.get('/products/?offset=0&amount=30&sort=productName&order=asc')
  .then(response => {
  response.data
}
```

<a name="approveProduct"/>

## Approve a product.

### URL

/products/approve

### Method

PUT

### Data Params

Example:
```
{
  id : Integer,
  approved : Integer,
  approvedBy : String,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              id : 1,
              approved : 1,
              approvedBy : "Nils Nilsson",
            }'
```
```javascript
axios.post('/products/approve', data)
  .then(response => {
  response
})
```

<a name="addProduct"/>

## Add a product.

### URL

/products/add

### Method

POST

### Data Params

Example:
```
{
    "productName" : String,
    "productVersion" : String,
    "dateCreated" : Date,
    "lastEdited" : Date,
    "comment" : String,
    "components" : [Integer,Integer]
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
    "productName":"Random product name",
    "productVersion":"1.0",
    "dateCreated":"2017-11-20",
    "lastEdited":"2017-11-20",
    "comment":"Third party handler Rest API for handling licenses.",
    "components":[1,2]
}'
```
```javascript
axios.post('/products/add', data)
  .then(response => {
  response
})
```

<a name="getPendingProducts"/>

## Show all pending products.

### URL

/products/pending/?offset=0&amount=30&sort=productName&order=desc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
"items": [{  "id":2,
              "productName":"Third-Party License Management WUI",
              "productVersion":"1.0",
              "dateCreated":"2017-11-20",
              "lastEdited":"2017-11-20",
              "comment":"Third party handler Rest API for handling licenses.",
              "approved":0,
              "approvedBy":"Nils Nilsson"}],
"links": {    "prev":"?offset=0&amount=5",
              "current":"?offset=0&amount=5",
              "next":"?offset=0&amount=5"},
"sort": {     "column":"&sort=productName",
              "order":"&order=desc"},
"meta": {     "current":0,
              "count":0},
"errors": {   "message":[],
              "status":"OK"},
"errorflag": false
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/pending/?offset=0&amount=30&sort=productName&order=desc')
  .then(response => {
  response.data
}
```

<a name="getProductsByComponentId"/>

## Show all products containing a certain component.

### URL

/products/productsWithComponent/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"componentName" : "A component",
"componentVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a component.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/productsWithComponent/1')
  .then(response => {
  response.data
}
```

<a name="connectComponentWithProduct"/>

## Connect a component with a product.

### URL

/products/connectComponentWithProduct

### Method

POST

### Data Params

Example:
```
{
    productID : Integer,
    componentID : Integer,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              productID : 1,
              componentID : 2,
            '
```
```javascript
axios.post('/products/connectComponentWithProduct', data)
  .then(response => {
  response
})
```

<a name="getProductsConnectedWithProject"/>

## Show all products connected to a certain project.

### URL

/products/productsInProject/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"projectName" : "A Project",
"projectVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a project.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/productsWithComponent/1')
  .then(response => {
  response.data
}
```

<a name="getProductsByLicenseId"/>

## Show all products containing a certain license.

### URL

/products/productsWithLicense/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"licenseName" : "A license",
"licenseVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a License.",
"URL" : "www.hej.se"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/productsWithLicense/1')
  .then(response => {
  response.data
}
```

<a name="showProductLogById"/>

## Show the log for a certain product.

### URL

/products/log/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"productID" : 1,
"dateLogged" : "2017-11-05",
"note" : "Product created."
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/log/1')
  .then(response => {
  response.data
}
```

<a name="changeCommentOfProduct"/>

## Change the comment of a certain product.

### URL

/products/comment

### Method

POST

### Data Params

Example:
```
{
    productID : Integer,
    comment : String,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              productID : 1,
              comment : "Detta är en ny kommentar",
            '
```
```javascript
axios.post('/products/comment', data)
  .then(response => {
  response
})
```

<a name="getProductById"/>

## Get the product with a certain ID.

### URL

/products/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
{
"id" : 1,
"productName" : "Third-Party License Management REST API",
"productVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "Third party handler Rest API for handling licenses.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/1')
  .then(response => {
  response.data
}
```

<a name="getProductByName"/>

## Get the product with a certain name.

### URL

/products/search/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = product name

### Success Response

Code: 200

Content:
```
{
"id" : 1,
"productName" : "Third-Party License Management REST API",
"productVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "Third party handler Rest API for handling licenses.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/search/Third-Party License Management REST API')
  .then(response => {
  response.data
}
```

<a name="projects"/>

# Projects

<a name="signedProjects"/>

## Show all signed projects

### URL

/projects/?offset=0&amount=30&sort=projectName&order=asc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{    "id":1,
                "projectName":"3PP Management Tool",
                "projectVersion":"1.0",
                "dateCreated":"2017-11-21",
                "lastEdited":"2017-11-21",
                "comment":"License manager solution for SAAB.",
                "approved":1,
                "approvedBy":"Nils Nilsson"}],
  "links":{     "prev":"?offset=0&amount=5",
                "current":"?offset=0&amount=5",
                "next":"?offset=0&amount=5"},
  "sort":{      "column":"&sort=projectName",
                "order":"&order=asc"},
  "meta":{      "current":0,
                "count":0},
  "errors":{    "message":[],
                "status":"OK"},
  "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/projects/?offset=0&amount=30&sort=projectName&order=asc')
  .then(response => {
  response.data
}
```

<a name="unsignedProjects"/>

## Show all unsigned projects

### URL

/projects/pending/?offset=0&amount=30&sort=projectName&order=asc

### Method

GET

### URL Params

Required:
```
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{    "id":1,
                "projectName":"3PP Management Tool",
                "projectVersion":"1.0",
                "dateCreated":"2017-11-21",
                "lastEdited":"2017-11-21",
                "comment":"License manager solution for SAAB.",
                "approved":0,
                "approvedBy":"Nils Nilsson"}],
  "links":{     "prev":"?offset=0&amount=5",
                "current":"?offset=0&amount=5",
                "next":"?offset=0&amount=5"},
  "sort":{      "column":"&sort=projectName",
                "order":"&order=asc"},
  "meta":{      "current":0,
                "count":0},
  "errors":{    "message":[],
                "status":"OK"},
  "errorflag":false
}
```

### Sample Call
```javascript
axios.get('/projects/?offset=0&amount=30&sort=projectName&order=asc')
  .then(response => {
  response.data
}
```

<a name="approveProject"/>

## Approve a project.

### URL

/projects/approve

### Method

PUT

### Data Params

Example:
```
{
  id : Integer,
  approved : Integer,
  approvedBy : String,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              id : 1,
              approved : 1,
              approvedBy : "Nils Nilsson",
            }'
```
```javascript
axios.post('/projects/approve', data)
  .then(response => {
  response
})
```

<a name="addProject"/>

## Add a project.

### URL

/projects/add

### Method

POST

### Data Params

Example:
```
{
    "projectName" : String,
    "projectVersion" : String,
    "comment" : String,
    "products" : [Integer,Integer]
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
    "projectName" : "A project",
    "projectVersion" : "1.0",
    "comment" : "Third party handler Rest API for handling licenses.",
    "products" : [1,2]
    }'
```
```javascript
axios.post('/project/add', data)
  .then(response => {
  response
})
```

<a name="showPendingProjects"/>

## Show all pending projects.

### URL

/projects/pending/

### Method

GET

### URL Params

Required:
none

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"projectName" : "A project",
"projectVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "Third party handler Rest API for handling licenses.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/project/pending')
  .then(response => {
  response.data
}
```

<a name="showProjectsConnectedWithComponent"/>

## Show all projects containing a certain component.

### URL

/projects/projectsWithComponent/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"projectName" : "A Project",
"projectVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a project.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/projects/projectsWithComponent/1')
  .then(response => {
  response.data
}
```

<a name="connectProductWithProject"/>

## Connect a product with a project.

### URL

/projects/connectProductWithProject

### Method

POST

### Data Params

Example:
```
{
    projectID : Integer,
    productID : Integer,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              projectID : 1,
              productID : 2,
            '
```
```javascript
axios.post('/projects/connectProductWithProject', data)
  .then(response => {
  response
})
```

<a name="showProjectsWithLicense"/>

## Show all projects containing a certain license.

### URL

/projects/projectsWithLicense/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"projectName" : "A Project",
"projectVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a project.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/projects/projectsWithLicense/1')
  .then(response => {
  response.data
}
```

<a name="showProjectsWithProduct"/>

## Show all projects containing a certain product.

### URL

/projects/projectsWithProduct/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"projectName" : "A Project",
"projectVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a project.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/products/productsWithLicense/1')
  .then(response => {
  response.data
}
```

<a name="showLogByProjectId"/>

## Show the log for a certain project.

### URL

/projects/log/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
[{
"id" : 1,
"projectID" : 1,
"dateLogged" : "2017-11-05",
"note" : "Project created."
}]
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/projects/log/1')
  .then(response => {
  response.data
}
```

<a name="changeCommentOfProject"/>

## Change the comment of a certain project.

### URL

/projects/comment

### Method

POST

### Data Params

Example:
```
{
    projectID : Integer,
    comment : String,
}
```

### Success Response

Code: 201

Content:
```
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
TODO

### Sample Call
```
let data = '{
              projectID : 1,
              comment : "Detta är en ny kommentar",
            '
```
```javascript
axios.post('/projects/comment', data)
  .then(response => {
  response
})
```

<a name="getProjectById"/>


## Get the project with a certain ID.

### URL

/projects/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = 1

### Success Response

Code: 200

Content:
```
{
"id" : 1,
"projectName" : "A Project",
"projectVersion" : "1.0",
"dateCreated" : "2017-11-20",
"lastEdited" : "2017-11-20",
"comment" : "This is a project.",
"approved" : 1,
"approvedBy" : "Nils Nilsson"
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/projects/1')
  .then(response => {
  response.data
}
```

<a name="getSignedProjectByName"/>


## Search for a specific signed project.

### URL

/projects/search/:id?offset=0&amount=30&sort=comment&order=asc

### Method

GET

### URL Params

Required:
```
id = projectName
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{    "id":1,
                "projectName":"3PP Management Tool",
                "projectVersion":"1.0",
                "dateCreated":"2017-11-21",
                "lastEdited":"2017-11-21",
                "comment":"License manager solution for SAAB.",
                "approved":1,
                "approvedBy":"Nils Nilsson"}],
  "links":{     "prev":"?offset=0&amount=5",
                "current":"?offset=0&amount=5",
                "next":"?offset=0&amount=5"},
  "sort":{      "column":"&sort=projectName",
                "order":"&order=asc"},
  "meta":{      "current":0,
                "count":0},
  "errors":{    "message":[],
                "status":"OK"},
  "errorflag":false
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/projects/search/:id?offset=0&amount=30&sort=comment&order=asc')
  .then(response => {
  response.data
}
```

<a name="getUnsignedProjectByName"/>


## Search for a specific unsigned project.

### URL

/projects/pending/search/:id?offset=0&amount=30&sort=comment&order=asc

### Method

GET

### URL Params

Required:
```
id = projectName
offset = Integer
amount = Integer
sort = String
order = asc OR desc
```

### Success Response

Code: 200

Content:
```
{
  "items":[{    "id":6,
                "projectName":"A project",
                "projectVersion":"1.0",
                "dateCreated":"12/12/2017",
                "lastEdited":"12/12/2017",
                "comment":"License manager solution for SAAB.",
                "approved":0,
                "approvedBy":"Nils Nilsson"}],
  "links":{     "prev":"?offset=0&amount=5",
                "current":"?offset=0&amount=5",
                "next":"?offset=0&amount=5"},
  "sort":{      "column":"&sort=comment",
                "order":"&order=asc"},
  "meta":{      "current":0,
                "count":0},
  "errors":{    "message":[],
                "status":"OK"},
  "errorflag":false
}
```

### Error Response

TODO

### Sample Call
```javascript
axios.get('/projects/pending/search/A project?offset=0&amount=30&sort=comment&order=asc')
  .then(response => {
  response.data
}
```
