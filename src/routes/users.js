const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const validation = require("./validation");

router.get("/users/sign-up", usersController.showPage);
router.get("/users/sign-in", usersController.signInForm);
router.get("/users/sign-out", usersController.signOut);
router.get("/users/upgrade", usersController.upgradeView);
router.post(
  "/users/sign-up/create",
  validation.validateUsers,
  usersController.createUser
);
router.post("/users/sign-in", validation.validateUsers, usersController.signIn);

module.exports = router;
