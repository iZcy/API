const express = require('express');
const router = express.Router();
const cardControllers = require('../controllers/cardControllers');

router
  .get('/', cardControllers.cardsGet)        // Menggunakan cardsGet untuk mendapatkan semua kartu
  .post('/', cardControllers.cardsPost)      // Menggunakan cardsPost untuk membuat kartu baru
  .patch('/:id', cardControllers.cardsPatch)  // Menggunakan cardsPatch untuk memperbarui kartu
  .delete('/:id', cardControllers.cardsDelete);  // Menggunakan cardsDelete untuk menghapus kartu

module.exports = router;