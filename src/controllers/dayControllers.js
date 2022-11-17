/* HTTP requests exported for day */
const pool = require('../db');
const { dataStructure } = require('../utils/dataStructure');

// Get products registered on a given date
exports.getDay = ('/days/:date', async (req, res) => {
    try {
        const { date } = req.params;

        /* I managaged to join 3 tables yay :-) */
        const allData = await pool.query('SELECT * FROM product JOIN transaction ON transaction_id = fk_transaction JOIN creditcard ON card_id = fk_card WHERE date_string = $1', [date]);

        const result = dataStructure(allData.rows);

        res.json(result);
    } catch (err) {
        console.error(err.message);
    }
});