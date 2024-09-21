const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Routes for cards
router.post('/', cardController.createCard); // Create card
router.get('/', cardController.getAllCards); // Get all cards
router.get('/:id', cardController.getCardById); // Get card by ID
router.put('/:id', cardController.updateCard); // Update card
router.delete('/:id', cardController.deleteCard); // Delete card

module.exports = router;
