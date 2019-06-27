const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
  validateUser: function(req, res, next) {
    jwt.verify(req.headers["authorization"], config.JWT_SECRET, function(
      err,
      decoded
    ) {
      if (err) {
        res
          .status(401)
          .send({ status: "error", message: err.message, value: null });
      } else {
        //
        console.log(decoded);
        // add user id to request
        req.userId = decoded._id;
        next();
      }
    });
  }
};
