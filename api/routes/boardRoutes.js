const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardControllers");

router
    .post("/", boardController.boardPost);

module.exports = router;