/* Moving filter functions here to not clutter HTTP requests */
updatedTransactions = (arr, fkArr) => arr.map(transaction => {
    /* Finding products with correct foreign key, creating an array of objects with products */
    const filteredProducts = fkArr.filter(product => {
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

transactionsWithProducts = (arr, fkArr) => arr.map(transaction => {
    /* Finding products with correct foreign key, creating an array of objects with products */
    const filteredProducts = fkArr.filter(product => {
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

data = (arr, fkArr) => arr.map(card => {
    /* Finding transactions with correct foreign key, creating an array of objects with transactions */
    const filteredTransactions = fkArr.filter(transaction => {
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

exports.updatedTransactions = updatedTransactions;
exports.transactionsWithProducts = transactionsWithProducts;
exports.data = data;