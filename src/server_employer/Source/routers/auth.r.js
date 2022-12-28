const express = require("express");
const router = express.Router();
const passport = require('passport');
const authController = require("../app/controllers/auth.c");

router.get("/sign_up", authController.sign_up);
router.get("/sign_in", authController.sign_in);
router.get("/forgot_pw", authController.forgot_pw);
router.get("/account_authentication", authController.account_authentication);
router.get('/reset_password/:email', authController.reset_password);
router.get('/verify', authController.verify);
router.get('/authentication', authController.authentication);



router.post('/sign_up', authController.postSignUp);
router.post('/sign_in', passport.authenticate('local', {
    failureRedirect: '/auth/sign_in',
    successRedirect: '/employer/homepage'
}), authController.postSignIn);
router.post('/forget_password', authController.post_forget_password);
router.post('/reset_password', authController.post_reset_password);

router.post('/logout', authController.postLogout);


module.exports = router;
