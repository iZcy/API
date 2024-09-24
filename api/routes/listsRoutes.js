const express = require("express");
const router = express.Router();
const accessControl = require("../middleware/accessControl");
const listsController = require("../controllers/listsControllers");

router.use(accessControl.parseTokenDataMiddleware);
router
  .get("/:boardId", listsController.listsGet)
  .post("/:boardId", listsController.listsPost)
  .patch("/:id", listsController.listsPatch)
  .delete("/:id", listsController.listsDelete);

module.exports = router;
