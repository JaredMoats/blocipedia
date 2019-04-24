const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const validation = require("./validation");

router.get("/users/sign-up", usersController.showPage);
router.post(
  "/users/sign-up/create",
  validation.validateUsers,
  usersController.createUser
);

module.exports = router;
