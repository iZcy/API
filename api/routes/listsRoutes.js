const express = require("express");
const router = express.Router();
const listsController = require("../controllers/listsControllers");

router
  .get("/:boardId", listsController.listsGet)
  .post("/:boardId", listsController.listsPost)
  .patch("/:id", listsController.listsPatch)
  .delete("/:id", listsController.listsDelete);

module.exports = router;
