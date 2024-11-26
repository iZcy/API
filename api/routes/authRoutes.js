const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const accessControl = require("../middleware/accessControl");

router.post("/register", authController.userRegister);

router
  .route("/login")
  .post(authController.userLogin)
  .get(
    accessControl.parseTokenDataMiddleware,
    authController.userLoginWithCookies
  );

router.use(accessControl.parseTokenDataMiddleware);

router.get("/logout", authController.userLogout);
router.get("/role", authController.userRole);
router.patch("/change-password", authController.userChangePassword);
router.delete("/delete/:userId", authController.userDelete);
router.patch("/update/:userId", authController.userUpdate);
router.get("/users", authController.getAllUserNameId);

module.exports = router;
