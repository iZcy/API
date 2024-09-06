// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers");

router
  .get("/", taskController.taskGet)
  .post("/", taskController.taskPost)
  .patch("/", taskController.taskPatch)
  .delete("/", taskController.taskDelete)
  .delete("/", taskController.taskDelete);

module.exports = router;
