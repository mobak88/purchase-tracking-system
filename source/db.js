/* Middleware that works between server and postgres database */

const Pool = require('pg').Pool;
require('dotenv').config();

const password = process.env.PSQL_PASSWORD;

const pool = new Pool({
    user: 'postgres',
    password: password,
    host: 'localhost',
    port: 5432,
    database: 'purchase_tracking_system'
});

module.exports = pool;