const express = require("express");
const router = express.Router();
const cardControllers = require("../controllers/cardControllers");
const accessControl = require("../middleware/accessControl");

router.use(accessControl.parseTokenDataMiddleware);

router
  .get("/:listId", cardControllers.cardsGet) // Menggunakan cardsGet untuk mendapatkan semua kartu
  .get("/card/:cardId", cardControllers.getCardById)
  .post("/:listId", cardControllers.cardsPost) // Menggunakan cardsPost untuk membuat kartu baru
  .patch("/:id", cardControllers.cardsPatch) // Menggunakan cardsPatch untuk memperbarui kartu
  .delete("/:id", cardControllers.cardsDelete) // Menggunakan cardsDelete untuk menghapus kartu
  .route("/collab/:cardId")
  .post(cardControllers.cardsAddCollaborator)
  .delete(cardControllers.cardsRemoveCollaborator);

module.exports = router;
