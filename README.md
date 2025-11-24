## Érettségi Mentor – NodeJS beadandó

Express + EJS + MySQL alapú mintaalkalmazás az érettségi, háromtáblás adatbázisra építve. Követelmények: reszponzív téma, autentikáció (regisztráció/bejelentkezés/kijelentkezés), kapcsolati űrlap mentéssel, üzenetek megjelenítése, valamint CRUD a vizsgatárgy táblára.

### Telepítés

1. Másold ki/pl. készítsd el a `.env` fájlt a `.env.example` alapján.
2. Töltsd fel a 3 txt adatfájlt (már UTF-8) a `data/` mappában hagyva (kész).
3. MySQL-ben futtasd a seed scriptet (törli és újratölti a táblákat!):

```bash
node scripts/seed.js
```

4. Indítás:

```bash
node indito.js
```

Alap admin: `admin` / `admin123` (env-ben módosítható). A session adatok MySQL-ben tárolódnak.

### Felépítés

- `app.js` – Express konfiguráció, session-kezelés, route-ok.
- `routes/` – index, auth, adatbázis lista, kapcsolat + üzenetek, CRUD.
- `models/` – adatbázis-műveletek (felhasználó, üzenet, vizsgák, tárgyak).
- `views/` – EJS nézetek Bootstrap 5 alapú, egyedi gradient stílussal.
- `scripts/seed.js` – adatbázis létrehozás, mintaadatok feltöltése, admin user.
- `public/` – statikus anyagok és saját stílus.

### Követelmények lefedése

- **Ingyenes reszponzív téma:** Bootstrap 5 + saját Space Grotesk/Playfair tipó és gradient design.
- **Autentikáció:** regisztráció, bejelentkezés, kijelentkezés; szerepkör: visitor / registered / admin.
- **Főoldal:** látványos hero és élő adatok a három táblából (top tárgyak, diákok, minta vizsga sorok).
- **Adatbázis menü:** joinolt lista a három táblából, tárgy szerinti szűréssel.
- **Kapcsolat menü:** űrlap, DB mentés időbélyeggel.
- **Üzenetek menü:** csak belépve, fordított időrendben listáz.
- **CRUD menü:** admin szerepkörrel vizsgatárgy felvétel, módosítás, törlés.

Dokumentációhoz illusztrációk a `views/` és `public/` állományok alapján készíthetők.
