// routes/commentsRoutes.js
const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsControllers");

router
  .get("/", commentsController.commentsGet)
  .post("/", commentsController.commentsPost)
  .patch("/", commentsController.commentsPatch)
  .delete("/", commentsController.commentsDelete);

module.exports = router;
