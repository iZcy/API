const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardControllers");

router
    .post("/", boardController.boardPost)
    .get("/", boardController.boardGet)
    .patch("/:id", boardController.boardPatch)
    .delete("/:id", boardController.boardDelete);

module.exports = router;
