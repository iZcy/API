const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/role", authController.role);
router.post("/change-password", authController.changePassword);

module.exports = router;
