const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/register", authController.userRegister);
// router.post("/login", authController.userLogin);
// router.get("/logout", authController.userLogout);
// router.get("/role", authController.userRole);
// router.post("/change-password", authController.userChangePassword);

module.exports = router;
