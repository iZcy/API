// routes/infoRoutes.js
const express = require("express");
const router = express.Router();
const infoController = require("../controllers/infoControllers");

router.get("/", infoController.getInfo);

module.exports = router;
