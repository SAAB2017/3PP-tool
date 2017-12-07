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
```
{
"id" : 1,
"licenseID" : 1,
"dateLogged" : 0,
"note" : "License created."
}
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
```
{
"id" : 9,
"licenseName" : "BSD 3-clause",
"licenseVersion" : "1.0",
"dateCreated" : "2017-11-01",
"lastEdited" : "2017-11-01",
"comment" : null
}
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
```
{
"id" : 9,
"licenseName" : "BSD 3-clause",
"licenseVersion" : "1.0",
"dateCreated" : "2017-11-01",
"lastEdited" : "2017-11-01",
"comment" : null
}
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
```
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
              licenseName : "New License",
              licenseVersion : "1.0",
              dateCreated : "2017-12-05",
              lastEdited : "2017-12-05",
              URL : "http://www.example.com",
              comment : "This is a comment.",
              licenseType : "Type of license."
            }'

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

/products

### Method

GET

### URL Params

Required: None

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

### Sample Call
```javascript
axios.get('/licenses/')
  .then(response => {
  response.data
}
```











## PUT /products/approve

Givet parametrar som JSON objekt i BODY; signeras en produkt. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/products/approve
```

## POST /products/add

Givet parametrar som JSON objekt i BODY; lägger till en produkt. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/products/add
```

## POST /products/connectProductWithComponent

Givet parametrar som JSON objekt i BODY; kopplas en komponent till en produkt. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/products/connectProductWithComponent
```

## GET /products/productsInProject/:id

Givet projekt id som JSON objekt i URL; returneras alla produkter som finns i ett projekt.

### Exempel på anrop:
```bash
http://localhost:3000/products/productsInProject/
```

## GET /products/productsWithLicense/:id

Givet licens id som JSON objekt i URL; returneras alla produkter som finns i ett projekt.

### Exempel på anrop:
```bash
http://localhost:3000/product/productsWithLicense/
```

## GET /products/productsWithComponent/:id

Givet komponent id som JSON objekt i URL; returneras alla produkter som finns i ett projekt.

### Exempel på anrop:
```bash
http://localhost:3000/products/productsWithLicense/
```

## GET /products/log/:id

Givet ett produkt id inskickat som JSON objekt; Returnerar loggen för produkten i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/products/log/{"id":"1"}
```

## GET /products/:id

Givet ett produkt id inskickat som en siffra; Returnerar en produkt.

### Exempel på anrop:
```bash
http://localhost:3000/products/1
```

## GET /products/search/:params

Givet parametrar som JSON objekt i URL; söker baserat på parametrarna. Om operationen lyckas returneras ett JSON objekt med produkten.

### Exempel på anrop:
```bash
http://localhost:3000/products/search/{"productName":"product"}
```

# Projects

## GET /projects

Returnerar alla projekt som finns i databasen i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/projects
```

## PUT /projects/approve

Givet parametrar som JSON objekt i BODY; signeras ett projekt. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/projects/approve
```

## POST /projects/add

Givet parametrar som JSON objekt i BODY; lägger till ett projekt. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/projects/add
```

## POST /projects/connectProductWithProject

Givet parametrar som JSON objekt i BODY; kopplas en produkt till ett projekt. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/projects/connectProductWithProject
```

## GET /projects/projectsWithLicense/:id

Givet licens id som JSON objekt i URL; returneras alla projekt som är kopplade till licensen.

### Exempel på anrop:
```bash
http://localhost:3000/projects/projectsWithLicense/{"id":"1"}
```

## GET /projects/projectsWithComponent/:id

Givet komponent id som JSON objekt i URL; returneras alla projekt som är kopplade till komponenten.

### Exempel på anrop:
```bash
http://localhost:3000/projects/projectsWithComponent/{"id":"1"}
```

## GET /projects/projectsWithProduct/:id

Givet produkt id som JSON objekt i URL; returneras alla projekt som är kopplade till produkten.

### Exempel på anrop:
```bash
http://localhost:3000/projects/projectsWithProduct/{"id":"1"}
```

## GET /projects/log/:id

Givet ett projekt id inskickat som JSON objekt; Returnerar loggen för projektet i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/projects/log/{"id":"1"}
```

## GET /projects/:id

Givet ett projekt id inskickat som en siffra; Returnerar ett projekt.

### Exempel på anrop:
```bash
http://localhost:3000/projects/1
```

## GET /projects/search/:params

Givet parametrar som JSON objekt i URL; söker baserat på parametrarna. Om operationen lyckas returneras ett JSON objekt med projektet.

### Exempel på anrop:
```bash
http://localhost:3000/projects/search/{"projectName":"project"}
```
