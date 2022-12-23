
const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthController = require("../app/controllers/auth.c");

router.get("/sign_in", AuthController.sign_in);

router.post("/sign_in", passport.authenticate('local', {
    failureRedirect: '/auth/sign_in',
    successRedirect: '/admin'
}));

router.post("/sign_out", AuthController.postSignOut);

module.exports = router;
