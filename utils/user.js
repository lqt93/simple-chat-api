const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
  getCleanUser: function(user) {
    if (!user) return {};
    let u = user.toJSON();
    delete u.password;
    return u;
  },
  generateToken: function(user) {
    //Dont use password and other sensitive fields
    //Use fields that are useful in other parts of the app/collections/models
    var u = {
      fullName: user.fullName,
      email: user.email,
      _id: user._id.toString(),
      avatar: user.avatar
    };

    return (token = jwt.sign(u, config.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    }));
  }
};
