/* HTTP requests exported for month/year */
const pool = require('../db');
const { dataStructure } = require('./../dataStructure');

exports.getMonthYear = ('/months/:month_number/:year_number', async (req, res) => {
    try {
        const { month_number, year_number } = req.params;
        const monthAndYear = `${month_number}.${year_number}`;

        const allData = await pool.query('SELECT * FROM product JOIN transaction ON transaction_id = fk_transaction JOIN creditcard ON card_id = fk_card WHERE substring(date_string from 4 for 8) = $1', [monthAndYear]);

        const result = dataStructure(allData.rows);

        res.json(result);
    } catch (err) {
        console.error(err.message);
    }
});