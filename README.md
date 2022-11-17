# Purchase tracking system

API for purchase tracking system

You need psql installed on your machine to run the database and change the password in db.js to your password.{<br />
Download PostgreSQL [Here](https://www.postgresql.org/download/){<br />
The recipe for creating database and tables can be found in [Here](https://github.com/mobak88/purchase-tracking-system/blob/main/database.sql)

## Connect to database

Open your terminal

Conect to PSQL
`psql -U postgres`

Conect to a DATABASE
`\c + DATABASE name`

## Endpoints

| Name           | Request type | Endpoint                                  | Body                                                                                                            |
| -------------- | ------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Add item       | POST         | http://localhost:8080/items               | {<br /> "name": "string",<br />"category": "string",<br />"price": "number",<br />}                             |
| Add card       | POST         | http://localhost:8080/cards               | {<br /> "card_number": "number",<br />"transaction_store": "string",<br />"transaction_place": "string",<br />} |
| Get card       | GET          | http://localhost:8080/cards/{id}          |                                                                                                                 |
| Get date       | GET          | http://localhost:8080/days/{date}         |                                                                                                                 |
| Get month-year | GET          | http://localhost:8080/days/{month}/{year} |                                                                                                                 |
| Delete card    | DELETE       | http://localhost:8080/cards/{id}          |                                                                                                                 |

### `start`

Start the server.

```
npm run start
# or
yarn start
```
