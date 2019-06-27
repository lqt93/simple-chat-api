const FriendshipModel = require("../models/Friendship");
const UserModel = require("../models/User");

const STATUS_VALUES = ["waiting", "linked", "blocked", "new", "canceled"];

module.exports = {
  getYourFriends: async (req, res, next) => {
    try {
      const friendships = await FriendshipModel.find({
        owner: req.userId,
        status: "linked"
      })
        .populate("friend", "fullName username email")
        .exec();

      friendships.map(friendship => {
        return friendship.friend;
      });

      return res.json({
        status: "success",
        message: "Get requests",
        value: friendships
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  getFriendRequest: async (req, res, next) => {
    try {
      const friendships = await FriendshipModel.find({
        friend: req.userId,
        status: "waiting"
      })
        .populate("friend", "fullName username email")
        .exec();

      friendships.map(friendship => {
        return friendship.friend;
      });

      return res.json({
        status: "success",
        message: "Get requests",
        value: friendships
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  create: async (req, res, next) => {
    const { friendId, status } = req.body;
    if (!friendId && !status)
      return res.status(400).json({
        status: "error",
        message: "Require friend's id and friendship's status",
        value: null
      });

    const checkFriendship = await FriendshipModel.findOne({
      owner: req.userId,
      friend: friendId
    });

    if (checkFriendship)
      return res.status(400).json({
        status: "error",
        message: "Friendship created",
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

      console.log("status", status);

      const friendship = await FriendshipModel.create({
        owner: req.userId,
        friend: friendId,
        status: status
      });

      return res.json({
        status: "success",
        message: "Request sent",
        value: friendship
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

      // updated friendship from requester with 'linked'
      if (status) friendship.status = status;
      if (typeof watched === "boolean") friendship.watched = watched;
      const updatedFriendship = await friendship.save();

      // accepted a friend's request then create a friendship for accepter with this requester
      if (status === "linked") {
        const newFriend = await FriendshipModel.create({
          owner: req.userId,
          friend: friendship.owner,
          status: "linked"
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

      if (currentFriendship) {
        const delFriendshipFromFriend = await FriendshipModel.deleteOne({
          owner: currentFriendship.friend,
          friend: req.userId
        });

        const delFriendshipFromOwner = await FriendshipModel.deleteOne({
          _id: currentFriendship._id
        });
      }

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
