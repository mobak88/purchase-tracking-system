/* HTTP requests exported for day */
const pool = require('../db');
const filteredItems = require('./../filterItems');

// Get products registered on a given date
exports.getDay = ('/days/:date', async (req, res) => {
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

        const transactionsWithProducts = filteredItems.transactionsWithProducts(transactions, products);

        const data = filteredItems.data(cards, transactionsWithProducts);

        const result = {
            data
        };

        res.json(result);
    } catch (err) {
        console.error(err.message);
    }
});