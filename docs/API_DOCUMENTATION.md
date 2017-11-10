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

# Components

## GET /components

Returnerar objekt innehållandes samtliga komponenter registerade i databasen.

### Exempel på anrop:
```bash
$ curl -k -u jill:secret http://localhost:3000/components
```

### Exempel på respons:
```json
[
  {
    "id":1,
    "componentName":"Test Components",
    "componentVersion":"1.0",
    "dateCreated":0,
    "lastEdited":0,
    "comment":"component comment",
    "approved":null,
    "approvedBy":null
  },
  {
      "id":2,
      "componentName":"Test Components 2",
      "componentVersion":"1.0",
      "dateCreated":0,
      "lastEdited":0,
      "comment":"component comment",
      "approved":null,
      "approvedBy":null
    }
]
```

## PUT /components

## DELETE /components

## PUT /components/:id

# Licenses

## GET /licenses

# Products

## GET /products

# Projects

## GET /projects
