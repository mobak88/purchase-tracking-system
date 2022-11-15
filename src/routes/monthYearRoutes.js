/* Routes for day */
const express = require('express');
const monthYearController = require('./../controllers/monthYearControllers');
const router = express.Router();

router
    .route('/months/:month_number/:year_number')
    .get(monthYearController.getMonthYear);

module.exports = router;