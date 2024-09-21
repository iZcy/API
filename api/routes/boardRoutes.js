const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardControllers");
const accessControl = require("../middleware/accessControl");

router.use(accessControl.parseTokenDataMiddleware);

router
  .get("/", boardController.boardGet)
  .post("/", boardController.boardPost)
  .patch("/:id", boardController.boardPatch)
  .delete("/:id", boardController.boardDelete);

module.exports = router;
