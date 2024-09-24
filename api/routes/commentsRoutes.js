// routes/commentsRoutes.js
const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsControllers");

router
  .get("/:cardId", commentsController.commentsGet)
  .post("/:cardId", commentsController.commentsPost)
  .patch("/:id", commentsController.commentsPatch)
  .delete("/:id", commentsController.commentsDelete);

module.exports = router;
