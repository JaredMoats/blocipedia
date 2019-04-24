const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new LocalStrategy(
        {
          usernameField: "email"
        },
        (email, password, done) => {
          /* Look for a user with a matching email */
          User.findOne({
            where: { email }
          }).then(user => {
            /* IF the user is not found or the passwords do not match,
            return an error message */
            if (!user || !authHelper.comparePass(password, user.password)) {
              return done(null, false, {
                message: "Invalid email or password"
              });
            }
            /* If all goes well, return the authenticated user */
            return done(null, user);
          });
        }
      )
    );

    //store the user's id in the session
    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

    /* Take the ID stored in the session and return the user associated with it */
    passport.deserializeUser((id, callback) => {
      User.findById(id)
        .then(user => {
          callback(null, user);
        })
        .catch(err => {
          callback(err, user);
        });
    });
  }
};
