/* HTTP requests exported for month/year */
//const pool = require('../db');

exports.getMonthYear = ('/months/:month_number/:year_number', async (req, res) => {
    try {
        const { month_number, year_number } = req.params;
        const month = month_number + year_number;
        res.json(month);
    } catch (err) {
        console.error(err.message);
    }
});