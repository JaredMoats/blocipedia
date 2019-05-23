const User = require("./models").User;
const bcrypt = require("bcryptjs");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeKey);
const Wiki = require("./models").Wiki;

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
          return user.updateAttributes({ role: 1 });
        }
      })
      .catch(error => {
        callback(error);
      });
  },
  downgradeUser(user, callback) {
    return User.findById(user.id).then(user => {
      console.log("Downgrade query attempted");
      stripe.subscriptions.update('prod_F6U3nLKbYrB5JQ', {cancel_at_period_end: true});
      return user.updateAttributes({ role: 0 });
    })
  },
  getUsersWikis(id, callback) {
    return Wiki.findAll({
      where: {
        userId: id
      }
    }).then(wikis => {
      callback(null, wikis);
    }).catch(err => {
      callback(err);
    });
  }
};
