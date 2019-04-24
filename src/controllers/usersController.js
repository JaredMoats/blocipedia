const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sendGrid = require("../sendGrid/sendGrid.js");
const User = require("../db/models").User;

module.exports = {
  showPage(req, res, next) {
    res.render("users/sign-up");
  },
  createUser(req, res, next) {
    /* Pull the values from the request's body */
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        console.log(err);
        res.redirect("/users/sign-up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          /* Send a registration email */
          sendGrid.newUserEmail(newUser.email);
          console.log(user.email);
          res.redirect("/");
        });
      }
    });
  },
  logUsers(req, res, next) {
    User.findAll()
      .then(users => {
        console.log(users);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
