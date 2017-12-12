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

# Licenses

## Show all licenses

### URL

/licenses

### Method

GET

### URL Params

Required: None

### Success Response

Code: 200

Content:
```json
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

### Sample Call
```javascript
axios.get('/licenses/')
  .then(response => {
  response.data
}
```

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
```json
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
```json
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
```json
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
```json
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

## Gets a specific license from its id.

### URL

/licenses/:id

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
```json
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
axios.get('/licenses/1')
  .then(response => {
  response.data
}
```

## Add a new license.

### URL

/licenses/add

### Method

POST

### Data Params

Example:
```json
{
  licenseName : String,
  licenseVersion : String,
  dateCreated : String,
  lastEdited : String,
  URL : String,
  comment : String,
  licenseType : String
}
```

### Success Response

Code: 201

Content:
```json
{
  send : "success"
}
```

### Error Response

Code: 500

Content:
```json
{
  error_id : "E04"
}
```


### Sample Call
```
let data = '{
              licenseName : "New License",
              licenseVersion : "1.0",
              dateCreated : "2017-12-05",
              lastEdited : "2017-12-05",
              URL : "http://www.example.com",
              comment : "This is a comment.",
              licenseType : "Type of license."
            }'
```
```javascript
axios.post('/licenses/add', data)
  .then(response => {
  response
})
```

## Search for a license based on its name.

### URL

/licenses/search/:params

### Method

GET

### URL Params

Required:
```json
params = String
```
Example: params = GNU AGPL

### Success Response

Code: 200

Content:
```json
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

# Components

## GET /components

Returnerar alla komponenter som finns i databasen i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/components
```

## PUT /components/approve

Givet parametrar som JSON objekt i BODY; signeras en komponent. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/components/approve
```

## POST /components/add

Givet parametrar som JSON objekt i BODY; lägger till en komponent. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/components/add
```

## POST /components/connectLicenseWithComponent

Givet parametrar som JSON objekt i BODY; kopplas en licens till en komponent. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/components/connectLicenseWithComponent
```

## GET /components/componentsInProduct/:id

Givet produkt id som JSON objekt i URL; returneras alla komponenter i en produkt.

### Exempel på anrop:
```bash
http://localhost:3000/components/componentsInProduct/{"id":"1"}
```

## GET /components/componentsInProject/:id

Givet projekt id som JSON objekt i URL; returneras alla komponenter i ett projekt.

### Exempel på anrop:
```bash
http://localhost:3000/components/componentsInProject/{"id":"1"}
```

## GET /components/componentsWithLicense/:id

Givet licens id som JSON objekt i URL; returneras alla komponenter som är kopplade till licensen.

### Exempel på anrop:
```bash
http://localhost:3000/components/componentsWithLicense/{"id":"1"}
```

## GET /components/log/:id

Givet komponent id som JSON objekt i URL; returneras loggen för en komponent.

### Exempel på anrop:
```bash
http://localhost:3000/components/log/{"id":"1"}
```

## GET /components/:id

Givet komponent id som siffra i URL; returneras en komponent.

### Exempel på anrop:
```bash
http://localhost:3000/components/1
```

## GET /components/search/:params

Givet parametrar som JSON i URL; returneras komponenter.

### Exempel på anrop:
```bash
http://localhost:3000/search/{"componentName":"component"}
```

# Products

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
# Projects

## Show all project

### URL

/projects

### Method

GET

### URL Params

Required: None

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

### Sample Call
```javascript
axios.get('/projects/')
  .then(response => {
  response.data
}
```

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

## Add a project.

### URL

/projects/add

### Method

POST

### Data Params

Example:
```
{
    id : Integer,
    projectName : String,
    projectVersion : String,
    dateCreated : Date,
    lastEdited : Date,
    comment : String,
    approved : Integer,
    approvedBy : String,
    projects : [{
                    id : Integer,
                 },
                 {
                    id : Integer,
                 }]
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
    projectName : "A project",
    projectVersion : "1.0",
    dateCreated : "2017-11-20",
    lastEdited : "2017-11-20",
    comment : "Third party handler Rest API for handling licenses.",
    approved : 1,
    approvedBy : "Nils Nilsson",
    project : [{
                    id : 1,
                 },
                 {
                    id : 2,
                 }]
            }'
```
```javascript
axios.post('/project/add', data)
  .then(response => {
  response
})
```

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

## Get the project with a certain name.

### URL

/projects/search/:id

### Method

GET

### URL Params

Required:
```
id = Integer
```
Example: id = project name

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
axios.get('/projects/search/Third-Party License Management REST API')
  .then(response => {
  response.data
}
```
