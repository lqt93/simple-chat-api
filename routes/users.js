const express = require("express");
const router = express.Router();
const UserHelpers = require("../helpers/user");
const userController = require("../controllers/user");
router.post("/reg", userController.create);
router.post("/auth", userController.authenticate);
router.put("/profile", UserHelpers.validateUser, userController.update);
router.get(
  "/current",
  UserHelpers.validateUser,
  userController.checkCurrentUser
);
module.exports = router;
