const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");

router.get("/", wikiController.index);
router.get("/publicWikis/new", wikiController.new);
router.get("/publicWikis/:id", wikiController.show);
router.get("/publicWikis/:id/edit", wikiController.edit);
router.get("/wikis/private-to-public", wikiController.makeDowngradeWikisPublic);
router.get("/publicWikis/add-collaborator/success",  wikiController.collaboratorSuccess);
router.get("/publicWikis/remove-collaborator/success", wikiController.removeCollaboratorSuccess);
router.post("/publicWikis/create", wikiController.create);
router.post("/publicWikis/:id/update", wikiController.update);
router.post("/publicWikis/:id/delete", wikiController.delete);
router.post("/publicWikis/:id/add-collaborator", wikiController.addCollaborator);
router.post("/publicWikis/:id/remove-collaborator", wikiController.removeCollaborator);

module.exports = router;
