// Routes for Friendship model
const express = require("express");
const router = express.Router();
const friendshipController = require("../controllers/friendship");
const UserHelpers = require("../helpers/user");

router.post("/", UserHelpers.validateUser, friendshipController.create);
router.put("/", UserHelpers.validateUser, friendshipController.update);
router.delete("/", UserHelpers.validateUser, friendshipController.delete);

module.exports = router;
