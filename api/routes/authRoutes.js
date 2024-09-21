const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/register", authController.userRegister);
router.post("/login", authController.userLogin);
router.get("/logout", authController.userLogout);
router.get("/role", authController.userRole);
router.patch("/change-password", authController.userChangePassword);
router.delete("/delete", authController.userDelete);
router.patch("/update", authController.userUpdate);

module.exports = router;
