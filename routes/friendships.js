// Routes for Friendship model
const express = require("express");
const router = express.Router();
const friendshipController = require("../controllers/friendship");

router.post("/", friendshipController.create);
router.put("/:id", friendshipController.update);
router.delete("/:id", friendshipController.delete);

module.exports = router;
