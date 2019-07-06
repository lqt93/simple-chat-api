const RoomModel = require("../models/Room");
const RoomParticipantModel = require("../models/RoomParticipant");

module.exports = {
  create: async (req, res, next) => {
    try {
      const roomParticipant = RoomParticipantModel.create({
        user: req.userId,
        room: req.body.room
      });

      res.json({
        status: "success",
        message: "Found public rooms",
        value: {
          participant: roomParticipant
        }
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  update: async (req, res, next) => {},
  delete: async (req, res, next) => {}
};
