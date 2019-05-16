const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const timestampPlugin = require("./plugins/timestamp");
const userPlugins = require("./plugins/userHashPassword");

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      return validator.isEmail(value);
    }
  },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  fullName: String,
  avatar: String
});

userSchema.plugin(uniqueValidator, { message: "is already taken." });
userSchema.plugin(userPlugins.setFullName);
userSchema.plugin(userPlugins.hashPassword);
userSchema.plugin(timestampPlugin);

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
