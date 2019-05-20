const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");

router.get("/", wikiController.index);
router.get("/publicWikis/new", wikiController.new);
router.get("/publicWikis/:id", wikiController.show);
router.get("/publicWikis/:id/edit", wikiController.edit);
router.post("/publicWikis/create", wikiController.create);
router.post("/publicWikis/:id/update", wikiController.update);
router.post("/publicWikis/:id/delete", wikiController.delete);

module.exports = router;