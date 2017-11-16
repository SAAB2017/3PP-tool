---
Titel: API dokumentation
Version: 0.1.0
---
# API dokumentation

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

## GET /licenses

Returnerar alla licenser som finns i databasen i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/licenses
```

## GET /licenses/licensesInComponent/:id

Givet ett komponent id inskickat som JSON objekt; Returnerar de licenser som är kopplade till komponenten i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/licenses/licensesInComponent/{"id":"1"}
```

## GET /licenses/log/:id

Givet ett licens id inskickat som JSON objekt; Returnerar loggen för licensen i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/licenses/log/{"id":"1"}
```

## GET /licenses/licensesInProduct/:id

Givet ett produkt id inskickat som JSON objekt; Returnerar de licenser som är kopplade till produkten i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/licenses/licensesInProduct/{"id":"1"}
```

## GET /licenses/licensesInProject/:id

Givet ett projekt id inskickat som JSON objekt; Returnerar de licenser som är kopplade till projektet i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/licenses/licensesInProject/{"id":"1"}
```

## GET /licenses/:id

Givet ett licens id inskickat som en siffra; Returnerar de licenser som är kopplade till projektet i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/licenses/1
```

## POST /licenses/add

Givet parametrar som JSON objekt i BODY; lägger till en licens. Om operationen lyckas returneras ett JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/licenses/add
```

## GET /licenses/search/:params

Givet parametrar som JSON objekt i URL; söker baserat på parametrarna. Om operationen lyckas returneras ett JSON objekt med licensen.

### Exempel på anrop:
```bash
http://localhost:3000/licenses/search/{"licenseName":"licens"}
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

## GET /products

Returnerar alla produkter som finns i databasen i form av JSON objekt.

### Exempel på anrop:
```bash
http://localhost:3000/products
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
