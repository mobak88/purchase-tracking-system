/* HTTP requests exported for items */
const pool = require('../db');
const clearArr = require('./cardControllers');

/* Creating array */
const itemsArr = [];

// Post item saved to array and exported
exports.postItem = ('/items', async (req, res) => {
    try {
        itemsArr.push(req.body);

        if (clearArr.cardIsSubmitted === true) {
            console.log(true);
            itemsArr.length = 0;
        }

        res.json(itemsArr);
    } catch (err) {
        console.error(err.message);
    }
});

exports.itemsArr = itemsArr;