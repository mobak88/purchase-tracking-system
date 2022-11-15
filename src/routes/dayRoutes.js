/* Routes for day */
const express = require('express');
const dayController = require('./../controllers/dayControllers');
const router = express.Router();

router
    .route('/days/:date')
    .get(dayController.getDay);

module.exports = router;