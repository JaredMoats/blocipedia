const wikiQueries = require("../db/queries.wikis.js");
const marked = require("marked");
const TurndownService = require("turndown");
const turndownService = new TurndownService();
const Wiki = require("../db/models").Wiki;
const Collaborator = require("../db/models").Collaborator;

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
      body: marked(req.body.body),
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
          wiki.body = turndownService.turndown(wiki.body);
          res.render("wikis/edit", { wiki });
        }
      });
    }
  },
  update(req, res, next) {
    console.log("before markdown converted to html");
    let body = marked(req.body.body);
    console.log("after markdown to html conversion");

    if(req.body.public) {
      let updatedPrivacy = false;
      wikiQueries.updateWiki(req.params.id, body, updatedPrivacy, (error, wiki) => {
        if(error || wiki == null) {
          console.log("Your error: " + error);
          res.redirect(401, `/publicWikis/${req.params.id}/edit`);
        } else {
          res.redirect(`/publicWikis/${req.params.id}`);
        }
      });
    } else if(req.body.private) {
      let updatedPrivacy = true;
      wikiQueries.updateWiki(req.params.id, body, updatedPrivacy, (error, wiki) => {
        if(error || wiki == null) {
          console.log("Your error: " + error);
          res.redirect(401, `/publicWikis/${req.params.id}/edit`);
        } else {
          res.redirect(`/publicWikis/${req.params.id}`);
        }
      });
    } else {
      let updatedPrivacy = null;
      wikiQueries.updateWiki(req.params.id, body, updatedPrivacy, (error, wiki) => {
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
  },
  addCollaborator(req, res, next) {
    wikiQueries.addCollaborator(req, (error, user) => {
      if(error) {
        console.log("There was an error: " + error);
        res.redirect("/");
      } else {
        res.redirect("/publicWikis/add-collaborator/success");
      }
    })
  },
  removeCollaborator(req, res, next) {
    wikiQueries.removeCollaborator(req, (error, user) => {
      if(error) {
        console.log("There was an error: " + error);
        res.redirect("/");
      } else {
        res.redirect("/publicWikis/remove-collaborator/success");
      }
    });
  },
  collaboratorSuccess(req, res, next) {
    res.render("wikis/addCollaboratorSuccess");
  },
  removeCollaboratorSuccess(req, res, next) {
    res.render("wikis/removeCollaboratorSuccess");
  }
}
