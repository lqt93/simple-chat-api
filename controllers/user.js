const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

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
    UserModel.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
        next(err);
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch) {
            const token = jwt.sign({ id: user._id }, req.app.get("secretKey"), {
              expiresIn: "1d"
            });
            delete user.password;
            res.json({
              status: "success",
              message: "user found!!!",
              data: {
                user: { email: user.email, fullName: user.fullName },
                token: token
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
