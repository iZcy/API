const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardControllers');

router
  .get('/', cardController.getAllCards)
  .post('/', cardController.createCard)
  .patch('/:id', cardController.updateCard)
  .delete('/:id', cardController.deleteCard);



module.exports = router;
