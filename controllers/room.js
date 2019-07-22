const RoomModel = require("../models/Room");
const RoomParticipantModel = require("../models/RoomParticipant");
const MessageModel = require("../models/Message");

module.exports = {
  getSinglePrivateRoom: async (req, res, next) => {
    try {
      const targetRoomId = req.params.id;
      if (!targetRoomId)
        return res.status(400).json({
          status: "error",
          message: "Require room's id",
          value: null
        });

      const room = await RoomParticipantModel.findOne({
        user: req.userId,
        room: targetRoomId
      })
        .populate({
          path: "room",
          model: "Room",
          select: "_id name members",
          populate: {
            path: "members",
            model: "User",
            select: "_id fullName"
          }
        })
        .exec();

      res.json({
        status: "success",
        message: room ? "Found Room" : "Not found",
        value: room
          ? {
              room: room
            }
          : null
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  getUserPrivateRooms: async (req, res, next) => {
    try {
      const rooms = await RoomParticipantModel.find(
        { user: req.userId },
        "_id room",
        {
          sort: { createdAt: -1 },
          limit: 15
        }
      )
        .populate({
          path: "room",
          model: "Room",
          select: "_id name members",
          populate: {
            path: "members",
            model: "User",
            select: "_id fullName"
          }
        })
        .exec();

      res.json({
        status: "success",
        message: "Found Rooms",
        value: {
          rooms: rooms
        }
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  getRoomInfo: function(req, res, next) {
    const roomId = req.params.id;
    if (!roomId)
      return res.status(400).json({
        status: "error",
        message: "Require room's id",
        value: null
      });
    RoomModel.findOne(
      {
        _id: roomId
      },
      "type _id name",
      function(err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "Found Room",
            value: {
              room: result
            }
          });
      }
    );
  },
  getMessages: async function(req, res, next) {
    const roomId = req.params.id;
    if (!roomId)
      return res.status(400).json({
        status: "error",
        message: "Require room's id",
        value: null
      });
    try {
      const sort = req.query.sort;
      const result = await MessageModel.find(
        {
          room: roomId
        },
        "type _id value createdAt",
        {
          limit: parseInt(req.query.limit) || null,
          skip: parseInt(req.query.skip) || 0,
          sort: sort
            ? JSON.parse(req.query.sort)
            : {
                createdAt: 1
              }
        }
      )
        .populate("owner")
        .exec();
      const count = await MessageModel.countDocuments({ room: roomId }).exec();
      res.json({
        status: "success",
        message: "Found messages",
        value: {
          messages: result,
          count: count
        }
      });
    } catch (err) {
      if (err) next(err);
    }
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
  searchExistRoom: async (req, res, next) => {
    try {
      let checkingMembers = req.body.members;
      checkingMembers.push(req.userId);
      const room = await RoomModel.findOne({
        creator: req.userId,
        members: {
          $all: checkingMembers
        }
      });
      if (room && room._id) {
        res.json({
          status: "warning",
          message: "Room existed",
          value: room
        });
      } else {
        next();
      }
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  create: async (req, res, next) => {
    const members = req.body.members;
    const roomName = req.body.name;
    const firstMsg = req.body.firstMsg;
    if (!members || !firstMsg)
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: members|firstMsg",
        value: null
      });
    const roomType = "direct";
    if (members.length > 1) {
      roomType = "group";
    }
    members = members.push(req.userId);
    try {
      const newRoom = await RoomModel.create({
        creator: req.userId,
        type: roomType,
        name: roomName,
        members: members
      });

      RoomParticipantModel.create({
        user: req.userId,
        room: newRoom._id
      });

      const promises = members.map(async member => {
        const roomParticipant = await RoomParticipantModel.create({
          user: member,
          room: newRoom._id
        });
        return roomParticipant;
      });
      const creatingRoomParticipants = await Promise.all(promises);

      const newMsg = await MessageModel.create({
        value: firstMsg,
        room: newRoom._id,
        owner: req.userId
      });

      res.json({
        status: "success",
        message: "Room created",
        value: newRoom
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  edit: function(req, res, next) {},
  delete: function(req, res, next) {}
};
