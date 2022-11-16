/* Routes for cards */
const express = require('express');
const cardController = require('./../controllers/cardControllers');
const router = express.Router();

router
    .route('/cards')
    .get(cardController.getAllCards)
    .post(cardController.postCard);

router
    .route('/cards/:id')
    .get(cardController.getCard)
    .delete(cardController.deleteCard);

module.exports = router;