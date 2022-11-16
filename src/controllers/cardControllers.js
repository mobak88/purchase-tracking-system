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

// Delete card
exports.deleteCard = ('/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const transactions = await pool.query('SELECT * FROM transaction WHERE fk_card = $1', [id]);
        const products = await pool.query('SELECT * FROM product');

        const productsIdArr = products.rows.filter(product => transactions.rows.find(transaction => product.fk_transaction === transaction.transaction_id)).map(product => product.product_id);

        // I got help with this one, could probably never manage to solve it my self
        await pool.query(`DELETE FROM product WHERE product_id IN (${productsIdArr.map((val, i) => `$${i + 1}`).join(', ')})`, [...productsIdArr]);
        await pool.query('DELETE FROM transaction WHERE fk_card = $1', [id]);
        await pool.query('DELETE FROM creditcard WHERE card_id = $1', [id]);

        res.json(`Card with id: ${id} deleted`);
    } catch (err) {
        console.error(err.message);
    }
});

// Post card
exports.postCard = ('/cards', async (req, res) => {
    const { card_number } = req.body;
});