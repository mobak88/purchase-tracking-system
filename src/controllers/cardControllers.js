/* HTTP requests exported for cards */
const pool = require('../db');
const filteredItems = require('../utils/filterItems');
const errorHandler = require('./../utils/errorHandler');

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

        errorHandler.checkIdIsNumber(id, res);

        const card = await pool.query('SELECT * FROM creditcard WHERE card_id = $1', [id]);

        errorHandler.checkIdExists(card, res);

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

        errorHandler.checkIdIsNumber(id, res);

        const transactions = await pool.query('SELECT * FROM transaction WHERE fk_card = $1', [id]);

        errorHandler.checkIdExists(transactions, res);

        const products = await pool.query('SELECT * FROM product');

        const productsIdArr = products.rows.filter(product => transactions.rows.find(transaction => product.fk_transaction === transaction.transaction_id)).map(product => product.product_id);

        // I got help with this query, could probably never manage to solve it my self
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
    const items = require('./itemControllers');
    const connection = await pool.connect();

    try {
        const { card_number, transaction_store, transaction_place } = req.body;

        errorHandler.checkIdIsNumber(card_number, res);

        const date = new Date;

        const year = date.getFullYear().toString().slice(-2);

        const dateString = `${date.getDate()}.${date.getMonth() + 1}.${year}`;

        const card = await pool.query(
            'SELECT * FROM creditcard WHERE card_number = $1', [card_number]
        );

        // Function that is used in both if and else to avoid repeating code 
        const insertProducts = async (newTransaction) => {
            await connection.query('BEGIN');

            const newItemsArr = items.itemsArr.map(item => {
                return { ...item, fk_transaction: newTransaction.rows[0].transaction_id };
            });

            // I cheated here using a for loop found solution here: https://github.com/brianc/node-postgres/issues/2658 
            for (let i = 0; i < newItemsArr.length; i++) {
                await pool.query(
                    'INSERT INTO product (product_name, category, price, fk_transaction) VALUES($1, $2, $3, $4) RETURNING *',
                    [newItemsArr[i].name, newItemsArr[i]?.name, newItemsArr[i].price, newItemsArr[i].fk_transaction]
                );
            }
        };

        // Check if card exists, push products and transaction to card if exists, create new card with products and transactions if not
        if (card.rows.length < 1) {
            const newCard = await pool.query(
                'INSERT INTO creditcard (card_number) VALUES($1) RETURNING *',
                [card_number]
            );

            const newTransaction = await pool.query(
                'INSERT INTO transaction (fk_card, transaction_store, transaction_place, date_string) VALUES($1, $2, $3, $4) RETURNING *',
                [newCard.rows[0].card_id, transaction_store, transaction_place, dateString]
            );

            insertProducts(newTransaction);
        } else {
            const newTransaction = await pool.query(
                'INSERT INTO transaction (fk_card, transaction_store, transaction_place, date_string) VALUES($1, $2, $3, $4) RETURNING *',
                [card.rows[0].card_id, transaction_store, transaction_place, dateString]
            );

            insertProducts(newTransaction);
        }

        await connection.query('COMMIT');

        res.json(card.rows);

        cardIsSubmitted = false;
    } catch (err) {
        console.error(err.message);
    }
});