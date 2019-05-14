// Routes for Message model
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");

router.get("/", messageController.get);
router.post("/", messageController.create);
router.put("/", messageController.edit);
router.delete("/", messageController.delete);

module.exports = router;
