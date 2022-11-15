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
        const cardsandTrans = await pool.query('SELECT * FROM creditcard JOIN transaction ON transaction_id = card_id');

        res.json(cardsandTrans.rows);
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

            /* Checking if products key exists, creating product array if it does not exist */
            if (transaction.products && transaction.products.length > 0) {
                return { ...transaction, products: [...transaction.products, filteredProducts] };
            } else {
                return { ...transaction, products: filteredProducts };
            }
        });

        /* Destructuring card because there are always only one card */
        const [rows] = card.rows;

        const cardWithTransactions = {
            /* Replace ...rows with cards: rows to separate card and transactions, I prefer to have them in one object */
            ...rows,
            transactions: updatedTransactions
        };

        res.json(cardWithTransactions);
    } catch (err) {
        console.error(err.message);
    }
});

// Get products registered on a given date
app.get('/days/:date', async (req, res) => {
    try {
        const { date } = req.params;

        /* I managaged to join 3 tables yay :-) */
        const allData = await pool.query('SELECT * FROM product JOIN transaction ON transaction_id = fk_transaction JOIN creditcard ON card_id = fk_card WHERE date_string = $1', [date]);

        /* Return unique cards */
        const cardNumberSet = new Set();

        const filteredCards = allData.rows.filter(card => {
            if (!cardNumberSet.has(card.card_number)) {
                cardNumberSet.add(card.card_number);
                return card;
            } else {
                return;
            }
        });

        /* Removing everything except card data */
        const cards = filteredCards.map(card => {
            return { card_number: card.card_number, card_id: card.card_id };
        });

        /* Return unique transactions */
        const transactionSet = new Set();

        const filteredTransactions = allData.rows.filter(transaction => {
            if (!transactionSet.has(transaction.transaction_id)) {
                transactionSet.add(transaction.transaction_id);
                return transaction;
            } else {
                return;
            }
        });

        /* Removing everything except transaction data */
        const transactions = filteredTransactions.map(transaction => {
            return {
                transaction_id: transaction.transaction_id,
                fk_card: transaction.fk_card,
                transaction_store: transaction.transaction_store,
                transaction_place: transaction.transaction_place,
                date_string: transaction.date_string
            };
        });

        /* Return unique product */
        const productSet = new Set();

        const filteredProducts = allData.rows.filter(product => {
            if (!productSet.has(product.product_id)) {
                productSet.add(product.product_id);
                return product;
            } else {
                return;
            }
        });

        /* Removing everything except product data */
        const products = filteredProducts.map(product => {
            return {
                product_id: product.product_id,
                product_name: product.product_name,
                category: product.category,
                price: product.price,
                fk_transaction: product.fk_transaction
            };
        });

        const transactionsWithProducts = transactions.map(transaction => {
            /* Finding products with correct foreign key, creating an array of objects with products */
            const filteredProducts = products.filter(product => {
                if (transaction.transaction_id === product.fk_transaction) {
                    return product;
                }
            });

            if (transaction.products && transaction.products.length > 0) {
                return { ...transaction, products: [...transaction.products, filteredProducts] };
            } else {
                return { ...transaction, products: filteredProducts };
            }
        });

        const data = cards.map(card => {
            /* Finding transactions with correct foreign key, creating an array of objects with transactions */
            const filteredTransactions = transactionsWithProducts.filter(transaction => {
                if (card.card_id === transaction.fk_card) {
                    return transaction;
                }
            });

            if (card.transactions && card.transactions.length > 0) {
                return { ...card, transactions: [...card.transactions, filteredTransactions] };
            } else {
                return { ...card, transactions: filteredTransactions };
            }
        });

        const result = {
            data
        };

        res.json(result);
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