# Dokumenation för REST API

- [Dokumenation för REST API](#dokumenation-för-rest-api)
  - [Översikt](#översikt)
  - [Resultattyper](#resultattyper)
    - [Singletons](#singletons)
    - [Headers only](#headers-only)
    - [Lists](#lists)
      - [Sorteringsorder](#sorteringsorder)
    - [Resurskomponenter](#resurskomponenter)
  - [API-format](#api-format)
	- [Dokumenationshistorik](#dokumenationshistorik)

## Översikt
API:et är allmänt RESTFUL och returnerar resultat i JSON. JSON-format som returneras av API:et är dokumenterade under rubriken [API-format](#api-format).

API:et har stöd för både HTTP och HTTPS, däremot tillämpas i det här dokumenationen endast HTTP.

## Resultattyper
Alla resultat som returneras görs genom JSON. Det finns tre allmäna resultattyper:
- Singletons
- Headers-only
- Lists

Huvudtypen för API-resultaten är `application/json`.

### Singletons
### Headers only
### Lists

#### Sorteringsorder
Sortering sker utifrån den permanenta identifieringsnumreringen (DOI) i databasen där det lägsta identifieringsnummret kommer först och den största sist.

## Resurskomponenter
De aktuella resurskomponenterna som stödjs av API:et är:

- komponenter
- licenser
- produkter
- projekt

De kan tillämpas ensamt:

resurs | beskrivning
:--- | :---
`/components` | returnerar en lista på alla komponenter
`/licenses` | returnerar en lista på alla licenser
`/products` | returnerar en lista på alla produkter
`/projects` | returnerar en lista på alla projekt

## API-format


## Dokumenationshistorik
- V1: 2017-11-21, first draft
