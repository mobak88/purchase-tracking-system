const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const cardRouter = require('./routes/cardRoutes');
const dayRouter = require('./routes/dayRoutes');
const monthYearRouter = require('./routes/monthYearRoutes');

const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8080;

// Middleware that can be used to enable CORS with various options
app.use(cors()); // Enable All CORS Requests

// Built-in middleware function in Express, parses incoming requests with JSON payloads
app.use(express.json());

// Imported routes to keep app file as small as possible
app.use('/', cardRouter);
app.use('/', dayRouter);
app.use('/', monthYearRouter);

//Get all transactions
app.get('/transactions', async (req, res) => {
    try {
        const allTransactions = await pool.query('SELECT * FROM transaction');
        res.json(allTransactions.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Get all products
app.get('/products', async (req, res) => {
    try {
        const allProducts = await pool.query('SELECT * FROM product');
        res.json(allProducts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen((port), () => {
    console.log(`App running on: http://${url}:${port}`);
});