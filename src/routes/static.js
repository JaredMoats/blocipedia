const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");

router.get("/", wikiController.index);

module.exports = router;
