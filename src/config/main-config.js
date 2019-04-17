/* main-config intializes all of the necessary
middleware and technolgies that are used in the
app */

require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const logger = require("morgan");
/* Not ready for passport yet */
//const passportConfig = require("./passport-config");

module.exports = {
  init(app, express) {
    /* Initialize EJS as the view renderer in express */
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    /* End of EJS initialization */
    /* Make express aware of assets folder (for css) */
    app.use(express.static(path.join(__dirname, "..", "assets")));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());
    app.use(
      session({
        secret: process.env.cookieSecret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1.21e9 } //set cookie login to expire in 14 days
      })
    );
    app.use(flash());
    app.use(logger("dev"));
    /* Not ready for passport yet */
    //passportConfig.init(app);
  }
};
