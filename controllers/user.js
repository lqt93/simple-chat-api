const validator = require("validator");
const UserModel = require("../models/User");
const FriendshipModel = require("../models/Friendship");
const userUtils = require("../utils/user");

const hasEmptyField = (body, requiredList) => {
  for (let field of requiredList) {
    if (validator.isEmpty(body[field])) return true;
  }
  return false;
};

const hasAnyAllowedField = (body, allowedList) => {
  for (let field of allowedList) {
    if (body.hasOwnProperty(field)) return true;
  }
  return false;
};

const getError = errorObj => {
  return errorObj.message || "Validation Error";
};

module.exports = {
  findUsers: async (req, res, next) => {
    const allowedFields = ["keyword"];
    if (!hasAnyAllowedField(req.query, allowedFields))
      return res.status(400).json({
        status: "error",
        message: "Missing field",
        value: null
      });

    try {
      const keyword = req.query.keyword;
      const isEmail = validator.isEmail(keyword);
      let searchTarget = {},
        fieldOptions = "";
      if (!isEmail) {
        searchTarget = {
          username: new RegExp(keyword, "i")
        };
        fieldOptions = "fullName username";
      } else {
        searchTarget = {
          email: new RegExp(keyword, "i")
        };
        fieldOptions = "fullName email";
      }
      searchTarget._id = { $ne: req.userId };
      let users = await UserModel.find(searchTarget, fieldOptions).limit(10);

      const promises = users.map(async user => {
        const friendship = await FriendshipModel.findOne({
          owner: req.userId,
          friend: user._id
        });
        let newUser = {};
        for (let field of ["fullName", "email", "_id", "username"]) {
          newUser[field] = user[field];
        }
        newUser.isFriend = !!friendship && friendship.status === "linked";
        newUser.isRequested = !!friendship && friendship.status === "waiting";
        newUser.friendship = friendship && friendship._id;
        return newUser;
      });

      const results = await Promise.all(promises);
      res.json({
        status: "success",
        message: "Found users",
        value: results
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  changePassword: async function(req, res, next) {
    const allowedFields = ["oldPassword", "newPassword"];
    if (!hasAnyAllowedField(req.body, allowedFields))
      return res.status(400).json({
        status: "error",
        message: "Missing field",
        value: null
      });

    try {
      const user = await UserModel.findOne({
        _id: req.userId
      });

      if (!user)
        return res.status(400).json({
          status: "error",
          message: "User not found",
          value: null
        });

      const isMatch = await user.comparePassword(req.body.oldPassword);

      if (!isMatch)
        return res.status(400).json({
          status: "error",
          message: "Unauthorized",
          value: null
        });

      user.password = req.body.newPassword;

      const updatedUser = await user.save();

      res.json({
        status: "success",
        message: "New password saved",
        value: null
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: String(error),
        value: null
      });
    }
  },
  update: async function(req, res, next) {
    const allowedFields = ["username", "firstName", "lastName", "password"];
    if (!hasAnyAllowedField(req.body, allowedFields))
      return res.status(400).json({
        status: "error",
        message: "No correct field to update",
        value: null
      });

    try {
      if (req.body.hasOwnProperty("username")) {
        const userWithUsername = await UserModel.findOne({
          username: req.body.username
        });

        if (userWithUsername)
          return res.status(400).json({
            status: "error",
            message: "Username is used",
            value: null
          });
      }

      const user = await UserModel.findOne({
        _id: req.userId
      });
      for (let field of allowedFields) {
        if (req.body[field]) user[field] = req.body[field];
      }
      const updatedUser = await user.save();
      res.json({
        status: "success",
        message: "Updated user",
        value: userUtils.getCleanUser(updatedUser)
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error,
        value: null
      });
    }
  },
  checkCurrentUser: function(req, res, next) {
    res.json({
      status: "success",
      message: "User is logged in",
      value: true
    });
  },
  create: async function(req, res, next) {
    if (
      hasEmptyField(req.body, [
        "email",
        "password",
        "username",
        "firstName",
        "lastName"
      ])
    )
      return res.status(400).json({
        status: "error",
        message: "One required field is empty",
        value: null
      });
    try {
      const userWithUserName = UserModel.findOne({ email: req.body.username });
      if (!userWithUserName)
        return res.status(400).json({
          status: "error",
          message: "Username has been used",
          value: null
        });
      const userWithEmail = UserModel.findOne({ email: req.body.email });
      if (!userWithEmail)
        return res.status(400).json({
          status: "error",
          message: "Email has been used",
          value: null
        });
      const newUser = await UserModel.create({
        ...req.body
      });
      return res.json({
        status: "success",
        message: "User added successfully!!!",
        value: null
      });
    } catch (error) {
      if (error)
        return res.status(400).json({
          status: "error",
          message: getError(error),
          value: null
        });
    }
  },
  authenticate: async function(req, res, next) {
    if (hasEmptyField(req.body, ["email", "password"]))
      return res.status(400).json({
        status: "error",
        message: "One required field is empty",
        value: null
      });
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).json({
          status: "error",
          message: "User not found",
          value: null
        });
      const isMatch = await user.comparePassword(req.body.password);
      if (isMatch) {
        res.json({
          status: "success",
          message: "user found!!!",
          value: {
            user: userUtils.getCleanUser(user),
            token: userUtils.generateToken(user)
          }
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Invalid email/password!!!",
          value: null
        });
      }
    } catch (error) {
      next(error);
    }
  }
};
