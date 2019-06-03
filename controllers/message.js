const MessageModel = require("../models/Message");

const targetFields = [
  "type",
  "createdAt",
  "updatedAt",
  "owner",
  "room",
  "value",
  "_id"
];

module.exports = {
  get: function(req, res, next) {},
  create: function(req, res, next) {
    if (!req.body.value || !req.body.roomId)
      return res.status(400).json({
        status: "error",
        message: "Require value and room's id of message",
        value: null
      });
    MessageModel.create(
      {
        type: req.body.type,
        value: req.body.value,
        room: req.body.roomId,
        owner: req.body.userId
      },
      function(err, result) {
        if (err) next(err);
        else {
          result.populate("owner", "_id fullName", function(err2, newMsg) {
            let responseObj = {};
            for (let field of targetFields) {
              responseObj[field] = newMsg[field];
            }
            responseObj.timeTicket = req.body.timeTicket;
            req.io.sockets.to(req.body.roomId).emit("room_msg", responseObj);
          });
          res.json({
            status: "success",
            message: "Message created",
            value: null
          });
        }
      }
    );
  },
  edit: function(req, res, next) {},
  delete: function(req, res, next) {}
};
