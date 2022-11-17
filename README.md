# Purchase tracking system

API for purchase tracking system

You need psql installed on your machine to run the database and change the password in db.js to your password
Download PostgreSQL [Here](https://www.postgresql.org/download/)
The recipe for creating database and tables can be found in [Here](https://github.com/mobak88/purchase-tracking-system/blob/main/database.sql)

## Connect to database

Open your terminal

Conect to PSQL
`psql -U postgres`

Conect to a DATABASE
`\c + DATABASE name`

## Endpoints

| Name | Request type | Endpoint                    | Body                        |
| ---- | ------------ | --------------------------- | --------------------------- |
| item | POST         | http://localhost:8080/items | { return "name": "string" } |

### `start`

Start the server.

```
npm run start
# or
yarn start
```
