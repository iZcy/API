const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router
  .get('/', cardController.getAllCards)
  .post('/', cardController.createCard)
  .get('/:id', cardController.getCardById)
  .patch('/:id', cardController.updateCard)
  .delete('/:id', cardController.deleteCard);



module.exports = router;
