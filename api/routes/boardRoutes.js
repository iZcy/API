const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardControllers");

router
  .post("/", boardController.boardPost)
  .get("/", boardController.boardGet)
  .patch("/", boardController.boardPatch)
  .delete("/", boardController.boardDelete);

module.exports = router;
