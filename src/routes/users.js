const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const validation = require("./validation");

router.get("/users/sign-up", usersController.showPage);
router.get("/users/sign-in", usersController.signInForm);
router.get("/users/sign-out", usersController.signOut);
router.get("/users/upgrade", usersController.upgradeView);
router.get("/users/upgrade/success", usersController.upgradeSuccess);
router.get("/users/downgrade", usersController.downgradeView);
router.get("/users/downgrade/success", usersController.downgradeSuccessView);
router.get("/users/:id/profile", usersController.showProfile);
router.get("/users/:id/collaborate", usersController.showCollaboration);
router.post(
  "/users/sign-up/create",
  validation.validateUsers,
  usersController.createUser
);
router.post("/users/sign-in", validation.validateUsers, usersController.signIn);
router.post("/users/downgrade/action", usersController.downgradeSuccess);

module.exports = router;
