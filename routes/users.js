const express = require("express");
const router = express.Router();
const UserHelpers = require("../helpers/user");
const userController = require("../controllers/user");
// public
router.post("/reg", userController.create);
router.post("/auth", userController.authenticate);
// private
router.get("/", UserHelpers.validateUser, userController.findUsers);
router.put("/profile", UserHelpers.validateUser, userController.update);
router.put(
  "/password_change",
  UserHelpers.validateUser,
  userController.changePassword
);
router.get(
  "/current",
  UserHelpers.validateUser,
  userController.checkCurrentUser
);
module.exports = router;
