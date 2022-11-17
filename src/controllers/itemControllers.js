/* HTTP requests exported for items */

/* Creating array */
const itemsArr = [];

// Post item saved to array and exported
exports.postItem = ('/items', async (req, res) => {
    try {
        itemsArr.push(req.body);

        res.json(itemsArr);
    } catch (err) {
        console.error(err.message);
    }
});

exports.itemsArr = itemsArr;