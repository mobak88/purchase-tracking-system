/* HTTP requests exported for cards */
const pool = require('../db');
const filteredItems = require('./../filterItems');

//Get all cards
exports.getAllCards = ('/cards', async (req, res) => {
    try {
        const cardsandTrans = await pool.query('SELECT * FROM creditcard JOIN transaction ON transaction_id = card_id');

        res.json(cardsandTrans.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//Get a card
exports.getCard = ('/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const card = await pool.query('SELECT * FROM creditcard WHERE card_id = $1', [id]);
        const transactions = await pool.query('SELECT * FROM transaction WHERE fk_card = $1', [id]);
        const products = await pool.query('SELECT * FROM product');

        const updatedTransactions = filteredItems.updatedTransactions(transactions.rows, products.rows);

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

exports.deleteCard = ('/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const filteredProducts = transactions.rows.map(transaction => {
            /* Finding products with correct foreign key, creating an array of objects with products */
            const newFilteredProducts = products.rows.filter(product => {
                if (product.fk_transaction === transaction.transaction_id) {
                    return product;
                }
            });

            return newFilteredProducts;
        });

        const filteredProductsArr = [];
        filteredProducts.forEach((arr) => {
            filteredProductsArr.push(...arr);
        });

        const productsIdArr = filteredProductsArr.map(product => product.product_id);

        /* I got help with this one, could probably never manage to solve it my self */
        const products = await pool.query(`DELETE * FROM product WHERE product_id IN (${productsIdArr.map((val, i) => `$${i + 1}`).join(', ')})`, [...productsIdArr]);

        const transactions = await pool.query('SELECT * FROM transaction WHERE fk_card = $1', [id]);
        const card = await pool.query('SELECT * FROM creditcard WHERE card_id = $1', [id]);

        res.json(transactions.rows);
    } catch (err) {
        console.error(err.message);
    }
});