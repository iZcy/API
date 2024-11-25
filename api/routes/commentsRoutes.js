// routes/commentsRoutes.js
const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsControllers");
const { parseTokenDataMiddleware } = require("../middleware/accessControl");

router
  .get("/:cardId", commentsController.commentsGetByCardId)
  .post("/:cardId", parseTokenDataMiddleware, commentsController.commentsPost)
  .patch("/:id", commentsController.commentsPatch)
  .delete("/:id", commentsController.commentsDelete);

module.exports = router;
