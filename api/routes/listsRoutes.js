const express = require("express");
const router = express.Router();
const listsController = require("../controllers/listsControllers");

router
  .get("/", listsController.listGet)
  .post("/", listsController.listPost)
  .patch("/", listsController.listPatch)
  .delete("/", listsController.listDelete);

module.exports = router;