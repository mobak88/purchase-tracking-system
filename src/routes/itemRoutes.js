const express = require('express');
const itemController = require('./../controllers/itemControllers');
const router = express.Router();

router
    .route('/items')
    .post(itemController.postItem);

module.exports = router;