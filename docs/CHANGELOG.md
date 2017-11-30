# Förändringslogg
Alla anmärkningsvärda ändringar i projektet kommer att dokumenteras i den här filen.

Formatet är baserat på [Keep a Changelog] och detta projekt följer [Semantic Versioning].

[Keep a Changelog]: http://keepachangelog.com/en/1.0.0/
[Semantic Versioning]: http://semver.org/spec/v2.0.0.html

### Förändringtyper
- Tillagt (added) - för nya funktioner
- Ändrat (changed) - för förändringar i befintlig funktionalitet
- Förlegat (deprecated) - för funktioner som kommer bli borttagna
- Borttaget (removed) - för borttagna funktioner
- Korrigerat (fixed) - för buggfixar
- Säkerhet (security) - i händelse av sårbarhet

## [Ej utgiven]

## [0.4.0] - 2017-11-30
### Tillagt
- Lagt till flikar för navigering.
- Lagt till i API: /licenses/URL samt /licenses/comment samt ^/pending
### Ändrat
- Korrigert smärre kosmetiska ingrepp i WUI.
- Bulma uppdaterad från version 0.6.0 till version 0.6.1.
- SQL-filen innehållandes demostrationsinnehåll har uppdaterats.
### Borttaget
- Drop-down i navigeringsmenyn har tagit bort och ersätts av tabbar i kroppnavigeringen.

## [0.3.0] – 2017-11-22
### Tillagt
- Sökning för komponenter genom dess namn
- Tillagt scrolling för listor
- Sökfunktion för lisenser och komponenter som togs bort i v0.2.1 är nu åter tillagt
- Tillagt funktionalitet för att lägga till produkt
- Tillagt funktionalitet för att söka efter produkt
- Tillagt detaljspecifikation för ett projekt med dess beroenden med avseende på licens, komponent och produkt

### Ändrat
- Namnet på WUI har bytt namn från "3PP Manager" till "License Management Tool" för att göra en mer tydlighet i vad WUI gör
- Förändrat hur komponenter läggs till
- Ändrat WUI för att göra den mer dynamisk
- Ändrat datumformatsvisualiseringen i WUI som följer den internationella standarden ISO 8601
- Ändrat API:ns kommunikation med databasen till att nyttja transaktioner
- Vissa databastabellnamn har omdöpts för att belysa större tydlighet i vad de innehåller för information
- Lagt till en mer realistisk demostrationsinnehåll i SQL-filen som laddar in en ny databasfil

### Korrigerat
- Korrigerat felaktigt dynamiskt omfrång i tabeller för WUI
- Korrigerat felstavade routningaddressering i API:et
- Korrigerat smärre fel för att validera mot ESlint
- Rensat API på funktioner som inte kommer att användas
- Korrigerat felaktighet i samband med visning av licenser i komponenterna
- Åtgärdat fel som i vissa situationer gjorde att samma licens förekom mer än en gång i detaljvyn för givet projekt
- Åtgärdet felet som kunde ses i vissa webbläsarkonsolen beträffande "e is not a function"

## [0.2.1] – 2017-11-15
### Korrigerat
- Felaktig visning i detaljvisning av projekt, produkt, lisens samt komponent åtgärdat

### Borttaget
- Sökfunktion för lisenser och komponenter borttages, ty bristande funktionalitet

## [0.2.0] – 2017-11-15
### Tillagt
- Sida som hanterar signering av produkter
- Sida som hanterar signering av komponenter
- Sökfunktion för lisenser
- Sökfunktion för komponenter
- Lagt till favoritikon

### Ändrat
- Grundförändringar i API-motoriken (back-end) som effektiviserar back-end
- Förändringar i API-anropslänkningen till back-end
- Anpassat tabeller i WUI för responsiv miljö

### Korrigerat
- Felaktiga länkreferenser i back-end åtgärdade
- Felaktiga länkreferenser i front-end åtgärdade

## 0.1.0 - 2017-11-08
### Tillagt
- Övergripande överblick över komponenter, produkter och projekt
- Licensöversikt som ger en överblick över licenser i databasen
- Möjliggörande att lägga till nya licenser, komponenter samt projekt i databasen

[Ej utgiven]: https://github.com/SAAB2017/3PP-tool/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/SAAB2017/3PP-tool/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/SAAB2017/3PP-tool/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/SAAB2017/3PP-tool/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/SAAB2017/3PP-tool/compare/v0.1.0...v0.2.0
