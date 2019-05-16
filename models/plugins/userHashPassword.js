const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

module.exports = {
  hashPassword: function(userSchema) {
    // Create a pre-save hook
    userSchema.pre("save", function(next) {
      let user = this;
      // only hash the password if it has been modified (or is new)
      if (!user.isModified("password")) return next();

      // generate a salt
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
        });
      });
    });
  },
  setFullName: function(userSchema) {
    userSchema.pre("save", function(next) {
      this.fullName = this.firstName + " " + this.lastName;
      next();
    });
  }
};
