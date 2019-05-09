const UserModel = require("../models/User");
const userUtils = require("../utils/user");

module.exports = {
  create: function(req, res, next) {
    UserModel.create(
      {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
      },
      function(err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "User added successfully!!!",
            data: null
          });
      }
    );
  },
  authenticate: function(req, res, next) {
    console.log("req.body", req.body);
    if (!req.body.email || !req.body.password) return res.send("EMPTY_FIELDS");
    UserModel.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
        next(err);
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch) {
            res.json({
              status: "success",
              message: "user found!!!",
              data: {
                user: userUtils.getCleanUser(user),
                token: userUtils.generateToken(user)
              }
            });
          } else {
            res.json({
              status: "error",
              message: "Invalid email/password!!!",
              data: null
            });
          }
        });
      }
    });
  }
};
