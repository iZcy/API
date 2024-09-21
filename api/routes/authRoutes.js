const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const accessControl = require("../middleware/accessControl");

router.post("/register", authController.userRegister);

router.use(accessControl.parseTokenDataMiddleware);
router.post("/login", authController.userLogin);
router.get("/logout", authController.userLogout);
router.get("/role", authController.userRole);
router.patch("/change-password", authController.userChangePassword);
router.delete("/delete", authController.userDelete);
router.patch("/update", authController.userUpdate);

module.exports = router;
