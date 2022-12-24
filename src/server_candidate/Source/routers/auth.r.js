const app = require('express');
const router = app.Router();
const authController = require('../app/controllers/auth.c');
const passport = require('passport');


router.get('/login', authController.login);
router.get('/signup', authController.signup);
router.get('/forget_password', authController.forget_password);
router.get('/authentication', authController.authentication);
router.get('/reset_password/:email', authController.reset_password);
router.get('/verify', authController.verify);


router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignup);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/candidate/home'
}), authController.postLogin);
router.post('/forget_password', authController.post_forget_password);
router.post('/reset_password', authController.post_reset_password);

// Authencation
router.get('/google',
    passport.authenticate('google', { failureRedirect: '/auth/login', successRedirect: '/candidate/home', failureMessage: true }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login', successRedirect: '/candidate/home', failureMessage: true }));

router.get('/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/login', successRedirect: '/candidate/home', failureMessage: true }));

module.exports = router;




























// const express = require('express');
// const router = express.Router();
// const {
//     signup,
//     signin,
//     forgetPassword,
// }  = require('../app/controllers/auth.c');


// router.post('/signup', signup);
// router.post('/signin', signin);
// router.post('/forgetPassword', forgetPassword);

// module.exports = router;