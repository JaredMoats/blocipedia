const User = require("./models").User;
const bcrypt = require("bcryptjs");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeKey);
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;

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
      stripe.subscriptions.update('sub_F6UyteYveLaXsX', {cancel_at_period_end: true});
      return user.updateAttributes({ role: 0 });
    })
  },
  getUsersWikis(id, callback) {
    return Wiki.all({
      where: {
        userId: id
      }
    }).then(wikis => {
      callback(null, wikis);
    }).catch(err => {
      callback(err);
    });
  },
  getUserCollaborations(id, callback) {
    return Wiki.all({
      include: [{
        model: Collaborator,
        as: "collaborators",
        where: { userId: id }
      }]
    }).then(wikis => {
      callback(null, wikis);
    }).catch(err => {
      callback(err);
    });
  }
};
