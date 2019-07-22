// Routes for Room model
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room");

router.get("/private", roomController.getUserPrivateRooms);
router.get("/private/:id", roomController.getSinglePrivateRoom);
router.get("/public", roomController.getPublicRooms);
router.get("/:id", roomController.getRoomInfo);
router.get("/:id/messages", roomController.getMessages);
router.post("/", roomController.searchExistRoom, roomController.create);
router.put("/", roomController.edit);
router.delete("/", roomController.delete);

module.exports = router;
