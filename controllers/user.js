const UserModel = require("../models/User");
const userUtils = require("../utils/user");

module.exports = {
  checkCurrentUser: function(req, res, next) {
    res.json({
      status: "success",
      message: "User is logged in",
      value: true
    });
  },
  create: function(req, res, next) {
    UserModel.create(
      {
        fullName: req.body.fullName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      },
      function(err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "User added successfully!!!",
            value: null
          });
      }
    );
  },
  authenticate: async function(req, res, next) {
    if (!req.body.email || !req.body.password) return res.send("EMPTY_FIELDS");
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
