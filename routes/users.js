const express = require("express");
const router = express.Router();
const UserHelpers = require("../helpers/user");
const userController = require("../controllers/user");
router.post("/reg", userController.create);
router.post("/auth", userController.authenticate);
router.get(
  "/current",
  UserHelpers.validateUser,
  userController.checkCurrentUser
);
module.exports = router;
