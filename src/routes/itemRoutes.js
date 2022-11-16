const express = require('express');
const monthYearController = require('./../controllers/monthYearControllers');
const router = express.Router();

router
    .route('/item')
    .get(monthYearController.getMonthYear);

module.exports = router;