/* Routes for cards */
const express = require('express');
const cardController = require('./../controllers/cardControllers');
const router = express.Router();

router
    .route('/cards')
    .get(cardController.getAllCards);

router
    .route('/cards/:id')
    .get(cardController.getCard);

module.exports = router;