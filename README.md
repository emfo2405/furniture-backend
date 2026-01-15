## FurnitureStore - API
Jag har skapat ett API för att kunna agera som ett lagerhanteringssystem för möbelaffären FurnitureStore. Detta inkluderar hantering av kategorier, produkter och att skapa användare samt låte dem logga in. API:et är skapat i syfte att kunna använda Create, Read, Update, Delete genom GET, POST, PUT, PATCH och DELETE.

### Anslutning till API
API:et är publicerat på Render och har URL:en: https://furniture-backend-aym8.onrender.com. Installationsvariabler för databasen finns i environmental variables på Render och kopplar till en MongoDB-databas. 

### Tabeller i databasen

#### Tabell för kategori
| Tabellnamn  | _id | name | description | 
| ------------- | ------------- | ------------- | ------------- | 
| category  | SERIAL PRIMARY KEY  | STRING NOT NULL  | STRING NOT NULL  | 

#### Tabell för produkter
| Tabellnamn  | _id | name | color | price | description | stock | image | categoryId | 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| product  | SERIAL PRIMARY KEY  | STRING NOT NULL  | STRING NOT NULL  | NUMBER NOT NULL  | STRING NOT NULL  |  NUMBER NOT NULL | STRING NOT NULL  | STRING NOT NULL  |

#### Tabell för användare
| Tabellnamn  | _id | username | email | emailVerified | verificationToken | password | role | name | 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| user  | SERIAL PRIMARY KEY  | STRING  | STRING NOT NULL  | BOOLEAN | STRING | STRING NOT NULL  | STRING  | STRING  |



### Hur man använder API:et 
Det finns olika sätt att använda API:et för att nå det, nedan finns en tabell över vilka metoder som kan användas och vad de innebär. 

| Metod  | Ändpunkt | Beskrivning | 
| ------------- | ------------- | ------------- |
| GET | /api | Kopplar upp till API |
| GET  | /categories/count  | Visar antal kategorier sparade |
| PUT  | /categories/{id}  | Uppdatera hela kategori med angett id |
| PATCH  | /categories/{id}  | Uppdatera delar av kategori med angett id |
| GET  | /categories/{id} | Visar en kategori med angett id |
| DELETE  | /categories/{id}  | Raderar en kategori med angett id |
| POST  | /categories  | Skapar en ny kategori med korrekt angett input |
| PATCH  | /categories  | Uppdaterar del i alla kategorier |
| GET  | /categories  | Visar alla sparade kategorier |
| POST  | /categories/{id}/products  | Skapar en ny produkt kopplad till kategori-id med korrekt angett input |
| PATCH  | /categories/{id}/products  | Uppdaterar del i produkt kopplad till ett kategori-id |
| GET  | /categories/{id}/products  | Visar alla sparade produkter med ett visst kategori-id |
| DELETE  | /categories/{id}/products  | Raderar en produkt med angett kategori-id |
| GET  | /loggedin  | Visar id på användaren som är inloggad |
| POST  | /signup  | Skapar en ny användare med korrekt angett input |
| POST  | /users/login  | Inloggning för en användare med korrekt angett input |
| GET  | /products/count  | Visar antal produkter sparade |
| PATCH  | /products/{id}/addStock  | Uppdaterar lagersaldo med specifikt nummer |
| PATCH  | /products/{id}/updateStock  | Uppdaterar lagersaldo med valfritt nummer |
| PUT  | /products/{id}  | Uppdatera hela produkt med angett id |
| PATCH  | /products/{id}  | Uppdatera delar av en produkt med angett id |
| GET  | /products/{id} | Visar en produkt med angett id |
| DELETE  | /products/{id}  | Raderar en produkt med angett id |
| POST  | /products  | Skapar en ny produkt med korrekt angett input |
| PATCH  | /products  | Uppdaterar del i alla produkter |
| GET  | /products  | Visar alla sparade produkter |
| GET  | /products/{id}/category  | Visar kategorin för en produkt med angett id |

#### Ett objekt som lägger till korrekt information om en kategori är uppbyggt så här:
```
{
  "name": "Namn",
  "description": "Beskrivning"
}
```

#### Ett objekt som lägger till korrekt information om en produkt är uppbyggt så här:
```
{
  "name": "Namn",
  "color": "Färg",
  "price": 100,
  "description": "Beskrivning",
  "stock": 10,
  "image": "bild-url",
  "categoryId": "id för kategori"
}
```

#### Ett objekt som lägger till korrekt information om en användare är uppbyggt så här:
```
{
  "email": "E-post",
  "password": "Lösenord"
}
```

