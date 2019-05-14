const RoomModel = require("../models/Room");
const MessageModel = require("../models/Message");

module.exports = {
  getMessages: function(req, res, next) {
    const roomId = req.params.id;
    if (!roomId)
      return res.status(400).json({
        status: "error",
        message: "Require room's id",
        value: null
      });
    MessageModel.find(
      {
        room: roomId
      },
      "type _id value",
      function(err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "Found messages",
            value: {
              messages: result
            }
          });
      }
    );
  },
  getPublicRooms: function(req, res, next) {
    RoomModel.find(
      {
        type: "public"
      },
      function(err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "Found public rooms",
            value: {
              rooms: result
            }
          });
      }
    );
  },
  create: function(req, res, next) {
    if (!req.body.type || !req.body.name)
      return res.status(400).json({
        status: "error",
        message: "Require type and name of room",
        value: null
      });
    RoomModel.create(
      {
        type: req.body.type,
        name: req.body.name
      },
      function(err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "Room created",
            value: null
          });
      }
    );
  },
  edit: function(req, res, next) {},
  delete: function(req, res, next) {}
};
