const validator = require("validator");
const UserModel = require("../models/User");
const userUtils = require("../utils/user");

const hasEmptyField = (body, requiredList) => {
  for (let field of requiredList) {
    if (validator.isEmpty(body[field])) return true;
  }
  return false;
};

const getError = errorObj => {
  return errorObj.message || "Validation Error";
};

module.exports = {
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
      return res.send("EMPTY_FIELDS");
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
      return res.send("EMPTY_FIELDS");
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
    } catch (err) {
      next(err);
    }
  }
};
