# Kassabuch → Lagerverwaltung

Dieses Projekt war ursprünglich ein einfaches "Kassabuch" (Fastify + Sequelize/SQLite + EJS).
Es wurde so angepasst, dass es die Mindestanforderungen aus "Übung 2 – Lagerverwaltungsprogramm"
erfüllt. Die bestehende Architektur (Fastify-Server, Sequelize-Models, SQLite-Datenbank, EJS-Views)
wurde dabei beibehalten und so wenig wie möglich, aber so viel wie nötig verändert.

## Was wurde geändert?

- **`Models/Categories.models.js` → `Models/Articles.models.js`**: Aus den bisherigen
  Buchungskategorien wurden Artikel-Stammdaten mit `ArticleNumber` (eindeutig), `Name`
  und `Description` (Punkt 1 der Aufgabenstellung).
- **`Models/Transactions.model.js`**: Aus den Kassabuch-Buchungen (`Amount`) wurden
  Lagerbuchungen mit `Quantity` (Menge), `Price` (Einkaufspreis), Referenz auf `Article`
  und `Type` (Zugang/Abgang). Das Datum wird weiterhin über das vorhandene `createdAt`-Feld
  abgebildet, kann aber beim Anlegen/Bearbeiten frei gewählt werden (Punkt 5).
- **`Models/Accounts.models.js` entfernt**: Der Kassabuch-Kontostand passte nicht mehr zum
  Anwendungsfall Lagerverwaltung und wurde durch die artikelbezogene Bestandsberechnung
  ersetzt (siehe `Features/inventory.js`).
- **`Features/inventory.js` (neu)**: Berechnet je Artikel den aktuellen Bestand (Summe
  Zugänge − Summe Abgänge), den gewichteten Durchschnittspreis der Zugänge (Punkt 9) und
  den daraus resultierenden Gesamtwert.
- **`server.js`**: Routen für Artikel (`/articles`, inkl. bisher fehlender Anlegen-Route),
  Bestand (`/stock`, Punkt 4), Bericht (`/report`, Punkt 6) und Statistik
  (`/statistics`, Top 3 Artikel nach Lagerwert, Punkt 7) ergänzt. Die bestehenden Routen
  für Buchungen (`/`, `/new`, `/:id`, `/:id/edit`, `/:id/delete`) bleiben erhalten und
  ermöglichen so weiterhin die nachträgliche Überprüfung aller Buchungen (Punkt 8).
- **Views**: `Views/Categories` → `Views/Articles` (inkl. neuer `Create.ejs`, da das
  Anlegen von Artikeln bisher fehlte); `Views/Stock`, `Views/Report`, `Views/Statistics`
  neu hinzugefügt; Buchungs-Views (`Views/Transactions/*`, `Views/Index.ejs`) auf die neuen
  Felder umgestellt. Im Layout wurde eine einfache Navigation ergänzt.

## Abdeckung der Anforderungen

| # | Anforderung | Umsetzung |
|---|---|---|
| 1 | Artikel hinzufügen | `/articles/new` |
| 2 | Artikel bearbeiten | `/articles/:id/edit` |
| 3 | Artikel löschen | `/articles/:id/delete` |
| 4 | Bestand anzeigen | `/stock` |
| 5 | Bestand aktualisieren (Datum, Menge, Preis) | `/new`, `/:id/edit` |
| 6 | Bericht generieren | `/report` |
| 7 | Statistik (Top 3 nach Lagerwert) | `/statistics` |
| 8 | Buchungen im Nachhinein überprüfbar | `/` (Journal) + `/:id` (Detail) |
| 9 | Gewichteter Durchschnittspreis | `Features/inventory.js`, angezeigt in `/stock` |

## Technische Anforderungen

- Datenhaltung: SQLite über Sequelize (unverändert aus dem Kassabuch übernommen).
- Benutzeroberfläche: Grafische Oberfläche im Browser (EJS-Views mit Bootstrap,
  unverändert aus dem Kassabuch übernommen).
- Fehlerbehandlung: Pflichtfelder in den Formularen (`required`), eindeutige
  Artikelnummer über einen `unique`-Constraint im Datenbank-Model.

## Starten

```bash
npm install
npm start
```

Die Datenbank wird beim Start neu aufgebaut (`sequelize.sync({force:true})`, unverändert
aus dem Original übernommen) und mit ein paar Beispiel-Artikeln und -Buchungen befüllt.
