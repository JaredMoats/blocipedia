const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sendGrid = require("../sendGrid/sendGrid.js");
const Wiki = require("../db/models").Wiki;
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
        res.redirect("/users/sign-in");
      } else {
        res.redirect("/");
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  showProfile(req, res, next) {
    if(!req.user) {
      res.render("wikis/notUser");
    } else {
      userQueries.getUsersWikis(req.params.id, (err, wikis) => {
        if(err || wikis == null) {
          console.log("This is your error: " + err);
          res.redirect("/");
        } else {
          res.render("users/profile", { wikis });
        }
      });
    }
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
    //call method that switches user's role
    //console.log(JSON.stringify(req));

    userQueries.downgradeUser(req.user); //successfully downgrades the user
    
    Wiki.update({ private: false }, { where: {userId: req.user.id, private: true}  })
    res.redirect("/users/downgrade/success");
  },
  downgradeAction(req, res, next) {
      
  },
  downgradeSuccessView(req, res, next) {
    if(!req.user) {
      res.render("wikis/notUser");
    } else {
      res.render("users/downgradeSuccess");
    }
  }
};
