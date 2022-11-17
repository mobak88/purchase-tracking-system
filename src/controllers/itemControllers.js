/* HTTP requests exported for items */

/* Creating array */
const itemsArr = [];

// Push items to array
exports.postItem = ('/items', async (req, res) => {
    try {
        itemsArr.push(req.body);

        res.json(itemsArr);
    } catch (err) {
        console.error(err.message);
    }
});

// Clear array function
exports.clearItemsArr = (() => {
    itemsArr.length = 0;
});

exports.itemsArr = itemsArr;