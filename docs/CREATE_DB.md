## Skapa en SQLite3-databas
För att skapa en databasfil i WebStorm gör följande:
1. Öppna terminalen i fliken _Terminal_.
2. Skriv följande i terminalen:
```terminal
sqlite3 backend/sqlite.db < backend/db-setup.sql
```
3. Filen `sqlite.db` har nu skapats i mappen _backend_.
