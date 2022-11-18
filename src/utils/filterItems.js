/* Moving filter functions here to not clutter HTTP requests */

/* Generic function that returns object with keyname added to avoid code repetition, takes an object, array and spesified keyname as paramaters */
const returnResult = (importObj, importArr, keyName) => {
    if (importObj[keyName] && importObj[keyName].length > 0) {
        return { ...importObj, [keyName]: [...importObj[keyName], importArr] };
    } else {
        return { ...importObj, [keyName]: importArr };
    }
};

/* Function maps array filters foreign key === id, takes array and foreign key as parameters, passes parameters to and returns returnResult */
updatedTransactions = (arr, fkArr) => arr.map(transaction => {
    /* Finding products with correct foreign key, creating an array of objects with products */
    const filteredProducts = fkArr.filter(product => {
        if (product.fk_transaction === transaction.transaction_id) {
            return product;
        }
    });

    return returnResult(transaction, filteredProducts, 'products');
});

/* Does the same as updatedTransactions could have used brackets to take card_id and  fk_card as parameters but it would become very difficult to read */
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