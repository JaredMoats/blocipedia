const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sendGrid = require("../sendGrid/sendGrid.js");
const stripe = require("stripe")("sk_test_snbmFObPKMJH63PNPU1GIxpD00Jk4RSl0G");
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
  signInForm(req, res, next) {
    res.render("users/sign-in");
  },
  signIn(req, res, next) {
    passport.authenticate("local")(req, res, () => {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign-in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  upgradeView(req, res, next) {
    if (!req.user) {
      res.render("wikis/notUser");
    } else {
      res.render("users/upgrade");
    }
  },
  upgradeSuccess(req, res, next) {
    if (!req.user) {
      res.render("wikis/notUser");
    } else {
      /*userQueries.upgradeUser(req.user, (error, user) => {
        /*if (error || user == null) {
          //res.redirect("/");
          console.log("Here is your error: " + error);
        } else {
          console.log("Upgrade successful");
          res.render("users/success");
        }*/
        /*res.render("users/success");
      });*/
      userQueries.upgradeUser(req.user);
      res.render("users/success");
    }
  },
  downgradeView(req, res, next) {
    if(!req.user) {
      res.render("wikis/notUser");
    } else {
      res.render("users/downgradeView");
    }
  },
  downgradeSuccess(req, res, next) {
    userQueries.downgradeUser(req.user);
    res.redirect("/users/downgrade/success");
  },
  downgradeSuccessView(req, res, next) {
    if(!req.user) {
      res.render("wikis/notUser");
    } else {
      res.render("users/downgradeSuccess");
    }
  }
};
