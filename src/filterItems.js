/* Moving filter functions here to not clutter HTTP requests */

const returnResult = (importObj, importArr, keyName) => {
    if (importObj[keyName] && importObj[keyName].length > 0) {
        return { ...importObj, [keyName]: [...importObj[keyName], importArr] };
    } else {
        return { ...importObj, [keyName]: importArr };
    }
};

updatedTransactions = (arr, fkArr) => arr.map(transaction => {
    /* Finding products with correct foreign key, creating an array of objects with products */
    const filteredProducts = fkArr.filter(product => {
        if (product.fk_transaction === transaction.transaction_id) {
            return product;
        }
    });

    return returnResult(transaction, filteredProducts, 'products');
});

data = (arr, fkArr) => arr.map(card => {
    /* Finding transactions with correct foreign key, creating an array of objects with transactions */
    const filteredTransactions = fkArr.filter(transaction => {
        if (card.card_id === transaction.fk_card) {
            return transaction;
        }
    });

    return returnResult(card, filteredTransactions, 'transactions');
});

exports.updatedTransactions = updatedTransactions;
exports.data = data;