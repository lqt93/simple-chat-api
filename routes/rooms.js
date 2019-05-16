// Routes for Room model
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room");

router.get("/public", roomController.getPublicRooms);
router.get("/:id", roomController.getRoomInfo);
router.get("/:id/messages", roomController.getMessages);
router.post("/", roomController.create);
router.put("/", roomController.edit);
router.delete("/", roomController.delete);

module.exports = router;
