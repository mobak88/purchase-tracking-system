const filteredItems = require('./filterItems');

/** 
  * Creating data structure function to avoid repeating code
  * even though a lot of the code are repeating below its 
  * very difficult to create reusable function when working with
  * chained objects
*/

exports.dataStructure = (allData) => {
    /* Return unique cards */
    const cardNumberSet = new Set();

    const filteredCards = allData.filter(card => {
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

    const filteredTransactions = allData.filter(transaction => {
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

    const filteredProducts = allData.filter(product => {
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

    return result;
};