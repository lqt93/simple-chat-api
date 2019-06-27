const FriendshipModel = require("../models/Friendship");
const UserModel = require("../models/User");

const STATUS_VALUES = ["waiting", "linked", "blocked", "new", "canceled"];

module.exports = {
  create: async (req, res, next) => {
    const { friendId, status } = req.body;
    if (!friendId && !status)
      return res.status(400).json({
        status: "error",
        message: "Require friend's id and friendship's status",
        value: null
      });

    try {
      const friend = await UserModel.findOne({
        _id: friendId
      });

      if (!friend)
        return res.status(400).json({
          status: "error",
          message: "User not found",
          value: null
        });

      const friendship = await FriendshipModel.create({
        owner: req.userId,
        friend: friendId,
        status: status
      });

      return res.json({
        status: "success",
        message: "Request sent",
        value: null
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: String(err),
        value: null
      });
    }
  },
  update: async (req, res, next) => {
    const friendshipId = req.params.id;
    if (!friendshipId)
      return res.status(400).json({
        status: "error",
        message: "Missing friendship's id",
        value: null
      });

    const { status, watched } = req.body;
    if (!status && typeof watched !== "boolean") {
      return res.status(400).json({
        status: "error",
        message: "Missing values to update",
        value: null
      });
    }

    if (STATUS_VALUES.indexOf(status) < 0) {
      return res.status(400).json({
        status: "error",
        message: "Value of status is not accepted",
        value: null
      });
    }

    try {
      const friendship = await FriendshipModel.findOne({
        _id: friendshipId
      });

      if (status) friendship.status = status;
      if (typeof watched === "boolean") friendship.watched = watched;

      const updatedFriendship = await friendship.save();

      if (status === "available") {
        const newFriend = await FriendshipModel.create({
          owner: friendship.friend,
          friend: req.userId
        });
      }

      return res.json({
        status: "success",
        message: "Friendship updated",
        value: null
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: String(err),
        value: null
      });
    }
  },
  delete: async (req, res, next) => {
    const friendshipId = req.params.id;

    if (!friendshipId) {
      return res.status(400).json({
        status: "error",
        message: "Missing friendship's id",
        value: null
      });
    }

    try {
      const currentFriendship = await FriendshipModel.findOne({
        _id: friendshipId
      });

      const delFriendshipFromFriend = await FriendshipModel.deleteOne({
        owner: currentFriendship.friend,
        friend: req.userId
      });

      const delFriendshipFromOwner = await FriendshipModel.deleteOne({
        _id: currentFriendship._id
      });

      res.json({
        status: "success",
        message: "Friendship deleted",
        value: null
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: String(err),
        value: null
      });
    }
  }
};
