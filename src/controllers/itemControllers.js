/* HTTP requests exported for items */
const pool = require('../db');

export const itemsArr = [];

exports.postItem = ('/item', async (req, res) => {
    try {
        const { name, category, price } = req.body;

        res.json(req.body);
    } catch (err) {
        console.error(err.message);
    }
});