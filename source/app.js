const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const url = process.env.URL || 'localhost';
const port = process.env.PORT || 8080;

// Middleware that can be used to enable CORS with various options
app.use(cors()); // Enable All CORS Requests

// Built-in middleware function in Express, parses incoming requests with JSON payloads
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World');
});


//Get all cards
app.get('/cards', async (req, res) => {
    try {
        const allCards = await pool.query('SELECT * FROM creditcard');
        const cardandTrans = await pool.query('SELECT * FROM creditcard JOIN transaction ON transaction_id = card_id');

        res.json(cardandTrans.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Get a card
app.get('/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const card = await pool.query('SELECT * FROM creditcard WHERE card_id = $1', [id]);
        const transactions = await pool.query('SELECT * FROM transaction WHERE fk_card = $1', [id]);
        const products = await pool.query('SELECT * FROM product');

        /* Creating an array of objects with transactions */
        const updatedTransactions = transactions.rows.map(transaction => {
            /* Finding products with correct foreign key, creating an array of objects with products */
            const filteredProducts = products.rows.filter(product => {
                if (product.fk_transaction === transaction.transaction_id) {
                    return product;
                }
            });

            /* Checking if products key exists */
            if (transaction.products && transaction.products.length > 0) {
                return { ...transaction, products: [...transaction.products, filteredProducts] };
            } else {
                return { ...transaction, products: filteredProducts };
            }
        });

        /* Destructuring card because there are always only one card */
        const [rows] = card.rows;

        const cardWithTransactions = {
            card: rows,
            transactions: updatedTransactions
        };

        res.json(cardWithTransactions);
    } catch (err) {
        console.error(err.message);
    }
});

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