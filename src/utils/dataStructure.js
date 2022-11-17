const filteredItems = require('./filterItems');

/** 
  * Creating data structure function to avoid repeating code
  * even though a lot of the code are repeating below its 
  * very difficult to create reusable function when working with
  * chained objects
*/

/* Reusable function to create arrays with unique values (set) */
const filterItems = (arr, uniqueSet, keyName) => {
    const filtered = arr.filter(item => {
        if (!uniqueSet.has(item[keyName])) {
            uniqueSet.add(item[keyName]);
            return true;
        }
        return false;
    });

    return filtered;
};

exports.dataStructure = (allData) => {
    /* Return unique cards */
    const cardNumberSet = new Set();

    const filteredCards = filterItems(allData, cardNumberSet, 'card_number');

    /* Removing everything except card data */
    const cards = filteredCards.map(card => {
        return { card_number: card.card_number, card_id: card.card_id };
    });

    /* Return unique transactions */
    const transactionSet = new Set();

    const filteredTransactions = filterItems(allData, transactionSet, 'transaction_id');

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

    const filteredProducts = filterItems(allData, productSet, 'product_id');

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

    const transactionsWithProducts = filteredItems.updatedTransactions(transactions, products);

    const data = filteredItems.data(cards, transactionsWithProducts);

    const result = {
        data
    };

    return result;
};