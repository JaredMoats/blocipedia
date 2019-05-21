const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    /* Encrypt the password */
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },
  upgradeUser(user, callback) {
    return User.findById(user.id)
      .then(user => {
        if (!user) {
          return callback("User not found");
        } else {
          //upgrade user to premium
          //user.role = 1;
          console.log("Upgrade query attempted");
        }
      })
      .catch(error => {
        callback(error);
      });
  }
};
