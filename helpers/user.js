const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
  validateUser: function(req, res, next) {
    jwt.verify(req.headers["authorization"], config.JWT_SECRET, function(
      err,
      decoded
    ) {
      if (err) {
        res.json({ status: "error", message: err.message, value: null });
      } else {
        // add user id to request
        req.body.userId = decoded._id;
        next();
      }
    });
  }
};
