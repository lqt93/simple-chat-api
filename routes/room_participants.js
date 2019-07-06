// Routes for RoomParticipant model
const express = require("express");
const router = express.Router();
const roomParticipantController = require("../controllers/roomParticipant");

router.post("/", roomParticipantController.create);
router.put("/", roomParticipantController.update);
router.delete("/", roomParticipantController.delete);

module.exports = router;
