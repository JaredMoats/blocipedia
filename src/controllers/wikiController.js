const wikiQueries = require("../db/queries.wikis.js");
const Wiki = require("../db/models").Wiki;

module.exports = {
  /* Show all the wikis in the database */
  index(req, res, next) {
    wikiQueries.getAllWikis((error, wikis) => {
      if (error) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },
  new(req, res, next) {
    if (!req.user) {
      res.render("wikis/notUser");
    } else {
      res.render("wikis/new");
    }
  },
  create(req, res, next) {
    /* Create an object with the form information */
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: false,
      userId: req.user.id
    };
    if(req.body.private) {
      newWiki.private = req.body.private;
    }
    /* Pass the object to the function that creates the wiki */
    wikiQueries.createWiki(newWiki, (error, wiki) => {
      if (error) {
        console.log("Your error: " + error);
        console.log("Your body that is an array or object: " + newWiki.body);
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/publicWikis/${wiki.id}`);
      }
    });
  },
  /* show the selected wiki */
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (error, wiki) => {
      if (error || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", { wiki });
      }
    });
  },
  edit(req, res, next) {
    if (!req.user) {
      res.render("wikis/notUser");
    } else {
      wikiQueries.getWiki(req.params.id, (error, wiki) => {
        if (error || wiki == null) {
          res.redirect(404, "/");
        } else {
          res.render("wikis/edit", { wiki });
        }
      });
    }
  },
  update(req, res, next) {
    if(req.body.public) {
      let updatedPrivacy = false;
      wikiQueries.updateWiki(req.params.id, req.body, updatedPrivacy, (error, wiki) => {
        if(error || wiki == null) {
          console.log("Your error: " + error);
          res.redirect(401, `/publicWikis/${req.params.id}/edit`);
        } else {
          res.redirect(`/publicWikis/${req.params.id}`);
        }
      });
    } else if(req.body.private) {
      let updatedPrivacy = true;
      wikiQueries.updateWiki(req.params.id, req.body, updatedPrivacy, (error, wiki) => {
        if(error || wiki == null) {
          console.log("Your error: " + error);
          res.redirect(401, `/publicWikis/${req.params.id}/edit`);
        } else {
          res.redirect(`/publicWikis/${req.params.id}`);
        }
      });
    } else {
      let updatedPrivacy = null;
      wikiQueries.updateWiki(req.params.id, req.body, updatedPrivacy, (error, wiki) => {
        if (error || wiki == null) {
          console.log("Your error: " + error);
          res.redirect(401, `/publicWikis/${req.params.id}/edit`);
        } else {
          res.redirect(`/publicWikis/${req.params.id}`);
        }
      });
    }
  },
  makeDowngradeWikisPublic(req, res, next) {
    wikiQueries.massPrivateToPublic();
  },
  delete(req, res, next) {
    if (!req.user) {
      res.render("wikis/notUser");
      return null;
    }

    wikiQueries.deleteWiki(req, (error, wiki) => {
      if (error) {
        res.redirect(error, `/publicWikis/${req.params.id}`);
      } else if (!req.user) {
        res.render("wikis/notUser");
      } else {
        res.redirect(303, `/`);
      }
    });
  }
};
